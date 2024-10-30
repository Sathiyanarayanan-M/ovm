"use client";

import React from "react";
import { socket } from "@/tools/socket";
import { useAppDispatch } from "@/lib/hooks";
import {
  addPlayer,
  initPlayers,
  updateAdmin,
  updateGameSettings,
  updateGameStatus,
  updateRoomId,
} from "@/lib/features/game/gameSlice";
import { updatePlayerId } from "@/lib/features/player/playerSlice";
import { IN_GAME, LOBBY_WAITING } from "@/constants/game";
import {
  updateArtist,
  updateRoundNo,
  updateRoundStatus,
  wordChosen,
} from "@/lib/features/rounds/roundsSlice";
import { CHOOSING_WORD, DRAWING } from "@/constants/round";
import useAudio from "@/tools/use-sound";

const SocketConnection = () => {
  const dispatch = useAppDispatch();
  const [isConnected, setIsConnected] = React.useState(false);
  const howlAudio = useAudio();
  const updatePlayerLocal = (data: PlayerState) => {
    const stringPlayer = JSON.stringify(data);
    localStorage.setItem("player", stringPlayer);
  };

  React.useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    // let interval: NodeJS.Timeout;

    function onDisconnect(data: string) {
      console.log("connect_error", data);
      setIsConnected(false);
      //   interval = setInterval(() => {
      //     reconnectSocket();
      //   }, 3000);
    }

    function connectionErr(err: Error) {
      // the reason of the error, for example "xhr poll error"
      console.log("connect_error", err.message);
    }

    function onJoinRoom(resp: JoinRoomSocketResp) {
      howlAudio('jr')
      const currentPlayer = resp.currentPlayer;
      const playersList = resp.players;
      const roomDetails = resp.room;
      dispatch(updateRoomId(roomDetails.id));
      dispatch(updatePlayerId(currentPlayer.id!));
      dispatch(updateAdmin(roomDetails.admin));
      dispatch(initPlayers(playersList));
      updatePlayerLocal(currentPlayer);
      dispatch(updateGameStatus(LOBBY_WAITING));
    }

    function newPlayer(data: PlayerState) {
      howlAudio('ty')
      dispatch(addPlayer(data));
    }

    function startGame(data: StartGameSocketResp) {
      howlAudio('amg')
      dispatch(updateGameStatus(IN_GAME));
      // const fData: FinalGameState = {
      //   ...data,
      //   startTime: data.start_time,
      //   endTime: data.end_time,
      // };
      dispatch(updateGameSettings(data));
      dispatch(updateRoundNo(data.round_no));
      dispatch(updateArtist(data.artist));
      dispatch(updateRoundStatus(CHOOSING_WORD));
    }

    function onError(msg: string) {
      if (window) {
        window.alert(msg);
      }
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", connectionErr);

    socket.on("join-room", onJoinRoom);
    socket.on("new-player", newPlayer);

    socket.on("start-game", startGame);
    socket.on("error", onError);

    return () => {
      socket.removeAllListeners();
    };
  }, []);
  return <></>;
};

export default SocketConnection;
