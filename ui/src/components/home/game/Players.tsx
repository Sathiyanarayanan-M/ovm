"use client";
import { selectGame, selectGamePlayers } from "@/lib/features/game/gameSlice";
import { selectPlayer } from "@/lib/features/player/playerSlice";
import { selectRound } from "@/lib/features/rounds/roundsSlice";
import { useAppSelector } from "@/lib/hooks";
import { getAvatar } from "@/tools/dicebar";
import { randomStr } from "@/utils/common";
import Image from "next/image";
import React from "react";

const Players = () => {
  const players = useAppSelector(selectGamePlayers);
  const room = useAppSelector(selectGame);
  const rounds = useAppSelector(selectRound);
  const currentPlayer = useAppSelector(selectPlayer);

  // Sorted is not needed here
  const pointsNumber = players
    .map((it) => it.points!)
    .toSorted((a, b) => b - a);

  return (
    <div className="flex flex-col">
      <p className="p-4 font-bold text-lg border-b border-pr-text text-center mb-5">{`Round ${rounds.roundNo}`}</p>
      {players.map((item, idx) => {
        const position = pointsNumber.indexOf(item.points!) + 1;
        const isArtist = rounds.artist === item.id;
        return (
          <div
            key={idx}
            className={`flex items-center justify-between gap-4 rounded py-2 px-4 ${
              isArtist && "bg-gray-400"
            }`}
          >
            <Image
              width={50}
              height={50}
              src={getAvatar(item.avatar)}
              alt={item.name}
            />
            <div className="mr-auto">
              <p className="font-bold">
                {item.name}
                {currentPlayer.id === item.id && " (YOU)"}
              </p>
              <p>{item.points}</p>
            </div>
            <div className={position === 1 ? "font-bold text-2xl" : ""}>
              #{position}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Players;
