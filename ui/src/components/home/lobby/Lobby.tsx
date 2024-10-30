"use client";
import React from "react";
import Settings from "./Settings";
import Players from "./Players";
import { useAppSelector } from "@/lib/hooks";
import { selectPlayer } from "@/lib/features/player/playerSlice";
import { selectGame } from "@/lib/features/game/gameSlice";
import dynamic from "next/dynamic";

const InviteLink = dynamic(() => import("./InviteLink"), {
  ssr: false,
});

const Lobby = () => {
  const currentPlayer = useAppSelector(selectPlayer);
  const currentGame = useAppSelector(selectGame);

  return (
    <div className="h-screen-nav p-4 flex gap-3 md:flex-col md:h-full">
      {currentGame.admin === currentPlayer.id && (
        <div className="border grid bg-red-100 basis-1/4 overflow-auto rounded">
          <Settings />
        </div>
      )}
      <div className="border bg-red-100 flex-1 overflow-auto rounded">
        <InviteLink />
        <Players />
      </div>
    </div>
  );
};

export default Lobby;
