from flask import Flask, json, request
import config
import controller
import helper
from flask_cors import CORS
from flask_socketio import (
    SocketIO,
    join_room,
    leave_room,
    close_room,
    rooms,
)
import events as SOCKET_EVENTS


app = Flask(__name__)
CORS(app, origins=config.ACCEPTED_ORiGINS)
socketio = SocketIO(
    app=app,
    cors_allowed_origins=config.ACCEPTED_ORiGINS,
)
config.testDBCon()


# API HANDLERS
@app.route("/")
def index():
    # cur, closeConn = config.get_db_connection()
    # cur.execute("SELECT * FROM player;")
    # players = cur.fetchall()
    # cur.execute("SELECT * FROM room;")
    # allRooms = cur.fetchall()
    # closeConn()
    # return json.jsonify({"players": players, "rooms": allRooms})
    return "HELLO WORLD"


@app.route("/words")
def random_words():
    cur, closeConn = config.get_db_connection()
    cur.execute("select name, count from words ORDER BY random() LIMIT 3;")
    words = cur.fetchall()
    closeConn()
    return json.jsonify({"status": 200, "data": words, "message": "Success"})


@socketio.on(SOCKET_EVENTS.CONNECTION_ON)
def clientConnect():
    print("CLIENT CONNECTED", request.sid)


@socketio.on(SOCKET_EVENTS.DISCONNECT_ON)
def clientDisconnect():
    playerRooms = rooms()
    print("CLIENT DISCONNECTED", request.sid, playerRooms)
    if len(playerRooms) > 1:
        playerId = request.sid
        roomId = helper.filterRoom(playerId, playerRooms)[0]
        gameFinished, nextRound, isArtist, data = controller.playerLeft(
            playerId, roomId
        )
        print("PLAYER_LEFT", gameFinished, nextRound, isArtist, data)
        socketio.emit("player-left", playerId, to=roomId)
        if gameFinished:
            print("GAME_FINISHED", data)
            socketio.emit("game-over", data, to=roomId)
            leave_room(roomId)
            close_room(roomId)
        elif nextRound or isArtist:
            socketio.emit("next-player", data, to=roomId)


@socketio.on("connection_error")
def clientError():
    print("connection_error: CLIENT DISCONNECTED", request.sid)


@socketio.on("create-room")
def createSocketRoom(data):
    player = {"name": data["name"], "id": request.sid, "avatar": data["avatar"]}
    resp = controller.createRoom(player)
    print(resp)
    if not resp["error"]:
        roomId = resp["data"]["room"]["id"]
        join_room(room=roomId)
        socketio.emit("join-room", resp["data"], to=roomId)
    else:
        socketio.emit("error", resp["message"], to=request.sid)


@socketio.on("join-room")
def joinSocketRoom(reqData):
    player = {
        "name": reqData["name"],
        "id": request.sid,
        "avatar": reqData["avatar"],
        "room_id": reqData["room_id"],
    }
    print("PLAYER_JOIN_ROOM", player)
    resp = controller.joinRoom(player)
    if not resp["error"]:
        roomId = resp["data"]["room"]["id"]
        join_room(room=roomId)
        socketio.emit("join-room", resp["data"], to=request.sid)
        socketio.emit(
            "new-player", resp["data"]["currentPlayer"], to=roomId, include_self=False
        )
    else:
        socketio.emit("error", resp["message"], to=request.sid)


@socketio.on("start-game")
def startGame(reqData):
    playerRooms = rooms()
    print("START_GAME", playerRooms)
    if len(playerRooms) > 1:
        playerId = request.sid
        roomId = helper.filterRoom(playerId, playerRooms)[0]
        playerReq = {
            "id": request.sid,
            "room_id": roomId,
            "rounds": reqData["rounds"],
            "language": reqData["language"],
            "duration": reqData["duration"],
        }
        resp = controller.startGame(playerReq)
        if not resp["error"]:
            socketio.emit("start-game", resp["data"], to=roomId)
        else:
            socketio.emit("error", resp["message"], to=request.sid)
    else:
        socketio.emit("error", "Room not found", to=request.sid)


@socketio.on("choose-word")
def chooseWord(reqData):
    playerRooms = rooms()
    if len(playerRooms) > 1:
        playerId = request.sid
        roomId = helper.filterRoom(playerId, playerRooms)[0]
        wordReq = {
            "id": request.sid,
            "room_id": roomId,
            "word": reqData,
        }
        controller.chooseGameWord(wordReq)
        socketio.emit("choose-word", to=wordReq["room_id"])
    else:
        socketio.emit("error", "Room not found", to=request.sid)


@socketio.on("guess")
def guess(reqData):
    playerRooms = rooms()
    if len(playerRooms) > 1:
        print("GUESS_PLAYER_ROOMS", playerRooms)
        playerId = request.sid
        roomId = helper.filterRoom(playerId, playerRooms)[0]
        isAlreadyGuessed = helper.isAlreadyGuessed(playerId)
        if isAlreadyGuessed:
            return
        word = reqData["word"]
        timeRem = reqData["d"]
        reqs = {
            "room_id": roomId,
            "player_id": request.sid,
            "word": word,
            "timeRem": timeRem,
        }
        gameFinished, nextRound, isCorrect, nextPlayer, data, playerPoint = (
            controller.guessWord(reqs)
        )
        print("IS_GUESS_CORRECT", gameFinished, nextRound, isCorrect, data, playerPoint)
        if isCorrect:
            socketio.emit("correct-guess", playerPoint, to=roomId)
            if gameFinished:
                print("GAME FINISHED", data)
                socketio.emit("game-over", data, to=roomId)
                leave_room(roomId)
                close_room(roomId)
            elif nextRound or nextPlayer:
                socketio.emit("next-player", data, to=roomId)
        else:
            socketio.emit("message", reqs, to=roomId)
    else:
        socketio.emit("error", "Room not found", to=request.sid)


@socketio.on("time-up")
def timeUp():
    playerRooms = rooms()
    if len(playerRooms) > 1:
        playerId = request.sid
        roomId = helper.filterRoom(playerId, playerRooms)[0]
        print("TIME_UP_PLAYER_ROOMS", playerRooms)
        helper.resetGuess(roomId)
        gameFinished, nextRound, data = controller.choseNextPlayer(roomId)

        if gameFinished:
            print("GAME FINISHED", data)
            socketio.emit("game-over", data, to=roomId)
            leave_room(roomId)
            close_room(roomId)
        else:
            print("NEXT PLAYER")
            print("IS NEXT ROUND", nextRound)
            socketio.emit("next-player", data, to=roomId)
    else:
        socketio.emit("error", "Room not found", to=request.sid)


@socketio.on("drawing")
def drawing(data):
    playerRooms = rooms()
    if len(playerRooms) > 1:
        playerId = request.sid
        roomId = helper.filterRoom(playerId, playerRooms)[0]
        socketio.emit("drawing", data, to=roomId, include_self=False)


@socketio.on("tool-change")
def toolChange(data):
    playerRooms = rooms()
    if len(playerRooms) > 1:
        playerId = request.sid
        roomId = helper.filterRoom(playerId, playerRooms)[0]
        print(data)
        socketio.emit("tool-change", data, to=roomId, include_self=False)


if __name__ == "__main__":
    app.run(debug=config.DEBUG)
    socketio.run(app, debug=True, engineio_logger=True)
