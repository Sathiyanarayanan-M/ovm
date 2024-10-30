import { selectGamePlayers } from "@/lib/features/game/gameSlice";
import { useAppSelector } from "@/lib/hooks";
import { getAvatar } from "@/tools/dicebar";
import Image from "next/image";
import React from "react";

const Players = () => {
  const players = useAppSelector(selectGamePlayers);

  return (
    <div className="p-4 grid grid-cols-8 md:grid-cols-6 xs:grid-cols-3 gap-4">
      {players.map((item, idx) => (
        <div key={idx} className="flex flex-col items-center justify-between">
          <Image
            width={100}
            height={100}
            src={getAvatar(item.avatar)}
            alt={item.name}
          />
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default Players;
