import config
import random
import math


def filterRoom(sid, rooms):
    room = [item for item in rooms if item != sid]
    return room


def roomExist(roomId):
    cur, closeConn = config.get_db_connection()
    query = "SELECT id FROM room WHERE id = %s;"
    cur.execute(query, (roomId,))
    room = cur.fetchone()
    closeConn()
    if room is None:
        return False
    return True


def getRoomDetails(roomId):
    cur, closeConn = config.get_db_connection()
    query = (
        "SELECT language, duration, rounds, admin, status, id FROM room WHERE id = %s;"
    )
    cur.execute(query, (roomId,))
    room = cur.fetchone()
    closeConn()
    return room


def getRoomPlayers(roomId):
    cur, closeConn = config.get_db_connection()
    query = "SELECT name, avatar, room_id, id, points FROM player WHERE room_id = %s;"
    cur.execute(query, (roomId,))
    players = cur.fetchall()
    closeConn()
    return players


def selectYetToPlayPlayers(roomId):
    cur, closeConn = config.get_db_connection()
    query = "SELECT name, avatar, room_id, id FROM player WHERE room_id = %s and is_played = FALSE;"
    cur.execute(query, (roomId,))
    players = cur.fetchall()
    closeConn()
    return players


def choosePlayer(players):
    cur, closeConn = config.get_db_connection()
    print("CHOOSE_PLAYER", players)
    chosen = random.choice(players)
    print("RANDOM_CHOSEN_PLAYER", chosen)
    query = "UPDATE player SET is_played=TRUE WHERE id = %s;"
    cur.execute(query, (chosen["id"],))
    closeConn()
    return chosen


def resetRounds(roomId):
    cur, closeConn = config.get_db_connection()
    query = "UPDATE player SET guessed = FALSE, is_played = FALSE WHERE room_id=%s;"
    cur.execute(query, (roomId,))
    closeConn()


def resetGuess(roomId):
    cur, closeConn = config.get_db_connection()
    query = "UPDATE player SET guessed = FALSE WHERE room_id=%s;"
    cur.execute(query, (roomId,))
    closeConn()


def isAlreadyGuessed(playerId):
    cur, closeConn = config.get_db_connection()
    query = "SELECT guessed FROM player where id=%s;"
    cur.execute(
        query,
        (playerId,),
    )
    playerResp = cur.fetchone()
    closeConn()
    return playerResp["guessed"]


def addGuessPoints(playerId, points):
    cur, closeConn = config.get_db_connection()
    query = "SELECT points FROM player WHERE id=%s;"
    cur.execute(query, (playerId,))
    player = cur.fetchone()
    print("ADD_GUESS_POINT", playerId, player)
    newPoints = player["points"] + points
    query = "UPDATE player SET points = %s, guessed = TRUE WHERE id=%s RETURNING id, points;"
    cur.execute(query, (newPoints, playerId))
    resData = cur.fetchone()
    closeConn()
    return resData


def addArtistPoints(roomId, timeRem):
    cur, closeConn = config.get_db_connection()
    query = "SELECT artist FROM room WHERE id=%s;"
    cur.execute(query, (roomId,))
    data = cur.fetchone()
    artistId = data["artist"]
    query = "SELECT guessed FROM player WHERE room_id=%s;"
    cur.execute(query, (roomId,))
    player = cur.fetchall()
    playersLen = len(player)
    guessedLen = 0
    for value in player:
        if value["guessed"]:
            guessedLen += 1
    guessPercent = 0
    if guessedLen > 0:
        guessPercent = guessedLen / playersLen
    artistPoints = math.floor(timeRem * guessPercent)
    addGuessPoints(artistId, artistPoints)
    print("ARTIST_POINTS", artistPoints, artistId)
    closeConn()


def addNextRound(prevRound, roomId):
    cur, closeConn = config.get_db_connection()
    playerYetToPlay = selectYetToPlayPlayers(roomId)
    chosenPlayer = choosePlayer(playerYetToPlay)
    values = {
        "id": roomId,
        "round_no": prevRound + 1,
        "artist": chosenPlayer["id"],
    }
    query = "UPDATE room SET round_no = %(round_no)s, artist = %(artist)s  WHERE id = %(id)s RETURNING id, round_no, artist;"
    cur.execute(query, values)
    data = cur.fetchone()
    closeConn()
    return data


def removePlayer(playerId):
    cur, closeConn = config.get_db_connection()
    query = "DELETE FROM player WHERE id=%s;"
    cur.execute(query, (playerId,))
    closeConn()


def getResults(roomId):
    cur, closeConn = config.get_db_connection()
    query = "SELECT id, points FROM player WHERE room_id = %s;"
    cur.execute(query, (roomId,))
    results = cur.fetchall()
    closeConn()
    return results
