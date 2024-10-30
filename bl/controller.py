import config
import common
import status
import constants
import helper


def createRoom(playerReq):
    roomId = common.randomIdGenerator()
    isRoomExist = helper.roomExist(roomId)
    if isRoomExist:
        return status.failureStatus(message="Room Not Found", status=404)
    playerDetails = {
        "name": playerReq["name"],
        "avatar": playerReq["avatar"],
        "id": playerReq["id"],
        "room_id": roomId,
    }
    cur, closeConn = config.get_db_connection()
    query = "INSERT INTO player (name, avatar, room_id, id) VALUES (%(name)s, %(avatar)s, %(room_id)s, %(id)s) RETURNING id, name, avatar, room_id, points;"
    cur.execute(query, playerDetails)
    player = cur.fetchone()
    roomDetails = {
        "admin": playerReq["id"],
        "id": roomId,
    }
    query = "INSERT INTO room (admin, id) VALUES (%(admin)s, %(id)s) RETURNING id, language, duration, rounds, admin, status;"
    cur.execute(query, roomDetails)
    room = cur.fetchone()
    closeConn()
    return status.successStatus(
        data={"currentPlayer": player, "players": [player], "room": room}
    )


def joinRoom(playerReq):
    roomId = playerReq["room_id"]
    room = helper.getRoomDetails(roomId)
    if room is None:
        return status.failureStatus("Room Not Found", 404)
    cur, closeConn = config.get_db_connection()
    query = "INSERT INTO player (name, avatar, room_id, id) VALUES (%(name)s, %(avatar)s, %(room_id)s, %(id)s) RETURNING id, name, avatar, room_id, points;"
    cur.execute(query, playerReq)
    player = cur.fetchone()
    players = helper.getRoomPlayers(roomId)
    closeConn()
    return status.successStatus(
        data={"currentPlayer": player, "players": players, "room": room}
    )


def startGame(playerReq):
    roomId = playerReq["room_id"]
    playerId = playerReq["id"]
    room = helper.getRoomDetails(roomId)
    print("ROOM_DETAILS", room)
    if room is None:
        return status.failureStatus("Room Not Found", 404)
    elif room["admin"] != playerId:
        return status.failureStatus("You are not a Admin", 401)
    cur, closeConn = config.get_db_connection()
    # startTime = datetime.datetime.now()
    # endTime = startTime + datetime.timedelta(seconds=playerReq["duration"])
    query = "UPDATE player SET status = %(status)s WHERE room_id = %(room_id)s;"
    cur.execute(query, {"status": constants.IN_GAME, "room_id": roomId})
    playerYetToPlay = helper.selectYetToPlayPlayers(roomId)
    chosenPlayer = helper.choosePlayer(playerYetToPlay)
    roomVal = {
        "status": constants.IN_GAME,
        # "start_time": str(startTime),
        # "end_time": str(endTime),
        "round_no": 1,
        "artist": chosenPlayer["id"],
    }
    values = {**roomVal, **playerReq}
    print("UPDATE_ROOM", values)
    query = "UPDATE room SET status = %(status)s, rounds = %(rounds)s, language = %(language)s, duration = %(duration)s, round_no = %(round_no)s, artist = %(artist)s WHERE id = %(room_id)s RETURNING id, language, duration, rounds, admin, status, round_no, artist;"
    cur.execute(query, values)
    updatedRoom = cur.fetchone()
    closeConn()
    return status.successStatus(data=updatedRoom)


def chooseGameWord(gameReq):
    cur, closeConn = config.get_db_connection()
    # query = "SELECT * from rounds where room_id=%s;"
    # cur.execute(query, (gameReq["room_id"],))
    # rounds = cur.fetchall()
    query = "UPDATE room SET chosen_word=%s WHERE id=%s;"
    cur.execute(
        query,
        (gameReq["word"], gameReq["room_id"]),
    )
    closeConn()


def choseNextPlayer(roomId):
    playerYetToPlay = helper.selectYetToPlayPlayers(roomId)
    gameFinished, nextRound = False, False
    data = {}
    cur, closeConn = config.get_db_connection()
    print("YET_TO_PLAY_PLAYERS", playerYetToPlay)
    if len(playerYetToPlay) == 0:
        query = "SELECT rounds, round_no, duration, artist FROM room WHERE id = %s;"
        cur.execute(query, (roomId,))
        rounds = cur.fetchone()
        if rounds["rounds"] <= rounds["round_no"]:
            print("GAME_FINISHED_ROOM", rounds)
            gameFinished = True
            data = helper.getResults(roomId)
        else:
            print("NEXT_ROUND_LIST_ROOM", rounds)
            nextRound = True
            # TODO
            # helper.addArtistPoints(roomId, rounds["duration"])
            helper.resetRounds(roomId)
            data = helper.addNextRound(rounds["round_no"], roomId)
    else:
        chosenPlayer = helper.choosePlayer(playerYetToPlay)
        values = {
            "id": roomId,
            "artist": chosenPlayer["id"],
        }
        print("NEW_CHOSEN_PLAYER", values)
        query = "UPDATE room SET artist = %(artist)s WHERE id = %(id)s RETURNING id, round_no, artist;"
        cur.execute(query, values)
        data = cur.fetchone()
    closeConn()
    return gameFinished, nextRound, data


def guessWord(gameReq):
    cur, closeConn = config.get_db_connection()
    query = "SELECT chosen_word FROM room WHERE id=%s;"
    cur.execute(
        query,
        (gameReq["room_id"],),
    )
    res = cur.fetchone()
    print("GUESS_WORD", res, gameReq)
    isCorrect = res["chosen_word"].lower() == gameReq["word"].lower()
    gameFinished, nextRound, nextPlayer = False, False, False
    data = {}
    playerPoint = {}
    if isCorrect:
        playerPoint = helper.addGuessPoints(gameReq["player_id"], gameReq["timeRem"])
        query = "SELECT id FROM player WHERE room_id=%s AND guessed = FALSE;"
        cur.execute(query, (gameReq["room_id"],))
        rData = cur.fetchall()
        print("GUESS_LIST", rData)
        isAllGuessed = len(rData)
        # 1 because exclusion of artist
        if isAllGuessed <= 1:
            print("ALL_GUESSED")
            nextPlayer = True
            helper.resetGuess(gameReq["room_id"])
            # TODO
            # helper.addArtistPoints(gameReq["room_id"], gameReq["timeRem"])
            resGameFinished, resNextRound, resData = choseNextPlayer(gameReq["room_id"])
            gameFinished, nextRound = resGameFinished, resNextRound
            data = resData
    closeConn()
    return gameFinished, nextRound, isCorrect, nextPlayer, data, playerPoint


def playerLeft(playerId, roomId):
    cur, closeConn = config.get_db_connection()
    helper.removePlayer(playerId)
    query = "SELECT id FROM player WHERE room_id = %s AND status = 'IN_GAME';"
    cur.execute(query, (roomId,))
    rData = cur.fetchall()
    isEveryoneLeft = len(rData) <= 1
    if isEveryoneLeft:
        gameFinished = True
        results = helper.getResults(roomId)
        return True, True, False, results
    query = "SELECT artist FROM room WHERE id=%s;"
    cur.execute(query, (roomId,))
    fData = cur.fetchone()
    print("REMOVE_PLAYER", fData)
    isArtist = fData["artist"] == playerId
    query = "SELECT id FROM player WHERE room_id=%s AND guessed = FALSE;"
    cur.execute(query, (roomId,))
    isAllGuessed = len(cur.fetchall())
    gameFinished, nextRound = False, False
    data = {}
    if isArtist or (isAllGuessed <= 1):
        helper.resetGuess(roomId)
        resGameFinished, resNextRound, resData = choseNextPlayer(roomId)
        gameFinished, nextRound = resGameFinished, resNextRound
        data = resData
    closeConn()
    return gameFinished, nextRound, isArtist, data
