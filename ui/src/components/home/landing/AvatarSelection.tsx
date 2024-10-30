"use client";
import React from "react";
import Image from "next/image";
import RefreshIcon from "@/components/icons/Refresh";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { randomStr } from "@/utils/common";
import {
  selectPlayerAvatar,
  selectPlayerName,
  updatePlayerAvatar,
  updatePlayerName,
} from "@/lib/features/player/playerSlice";
import { getAvatar } from "@/tools/dicebar";

const AvatarSelection = () => {
  const playerAvatar = useAppSelector(selectPlayerAvatar);
  const playerName = useAppSelector(selectPlayerName);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const playerDetails = localStorage.getItem("player");
    if (playerDetails) {
      const parsedPlayer = JSON.parse(playerDetails);
      dispatch(updatePlayerName(parsedPlayer.name || ""));
      dispatch(updatePlayerAvatar(parsedPlayer.avatar || ""));
    } else {
      dispatch(updatePlayerAvatar(new Date().getDate().toString()));
    }
  }, []);

  return (
    <div className="md:order-2">
      <div className="p-2 all-center">
        <div className="w-80 h-96 flex flex-col">
          {playerAvatar && (
            <Image
              src={getAvatar(playerAvatar)}
              alt="avatar"
              width={300}
              height={300}
              priority
              className="h-[300px] w-[300px]"
            />
          )}
          <input
            value={playerName}
            type="text"
            placeholder="Enter Your Name"
            className="block w-full mx-auto mt-auto placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-pr-text focus:border-pr-text focus:outline-none focus:ring focus:ring-pr-bg focus:ring-opacity-40  "
            maxLength={20}
            onChange={(e) => {
              dispatch(updatePlayerName(e.target.value));
            }}
          />
        </div>
        <button
          className="p-2 all-center border border-pr-text rounded-full mb-auto hover:rotate-90 transition duration-500 "
          onClick={() => {
            dispatch(updatePlayerAvatar(randomStr()));
          }}
          title="Change Avatar"
        >
          <RefreshIcon height={20} width={20} />
        </button>
      </div>
    </div>
  );
};

export default AvatarSelection;
