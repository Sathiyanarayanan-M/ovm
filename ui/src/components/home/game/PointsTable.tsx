import React from "react";
import { selectGamePlayers } from "@/lib/features/game/gameSlice";
import { useAppSelector } from "@/lib/hooks";

const PointsTable = () => {
  const gamePlayers = useAppSelector(selectGamePlayers);
  const sortedPlayers = gamePlayers.toSorted((a,b) => b.points - a.points)
  const pointsMap = sortedPlayers.map((item) => item.points)

  return (
    <div>
      {sortedPlayers.map((item) => (
        <div key={item.id} className="flex gap-5 justify-between items-center text-2xl mb-2">
          <p className="text-wrap text-center">
           #{pointsMap.indexOf(item.points) + 1}&nbsp;<b>{item.name} </b>
          </p>
          <p>{item.points}</p>
        </div>
      ))}
    </div>
  );
};

export default PointsTable;
