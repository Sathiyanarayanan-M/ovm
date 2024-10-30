"use client";
import React from "react";
import { useAppSelector } from "@/lib/hooks";
import { selectGameStatus } from "@/lib/features/game/gameSlice";
import { HOME_SCREEN, LOBBY_WAITING } from "@/constants/game";
import Landing from "./landing/Landing";
import dynamic from "next/dynamic";

const Lobby = React.lazy(() => import("./lobby/Lobby"));
const Game = React.lazy(() => import("./game/Game"));

const SocketConnection = dynamic(() => import("./SocketConnection"), {
  ssr: false,
});

const Home = () => {
  const gameStatus = useAppSelector(selectGameStatus);
  const PageToRender =
    gameStatus === HOME_SCREEN
      ? Landing
      : gameStatus === LOBBY_WAITING
      ? Lobby
      : Game;

  return (
    <>
      <SocketConnection />
      <PageToRender />
    </>
  );
};

export default Home;
