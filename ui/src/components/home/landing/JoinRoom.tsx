"use client";
import React from "react";
import {
  selectPlayerAvatar,
  selectPlayerName,
} from "@/lib/features/player/playerSlice";
import { useAppSelector } from "@/lib/hooks";
import ArrowRightIcon from "@/components/icons/ArrowRight";
import { socket } from "@/tools/socket";
import dynamic from "next/dynamic";
import useAudio from "@/tools/use-sound";

const SearchParamsSetting = dynamic(() => import("./SearchParamsSetting"), {
  ssr: false,
});

const JoinRoom = () => {
  const playerAvatar = useAppSelector(selectPlayerAvatar);
  const playerName = useAppSelector(selectPlayerName);

  const [roomId, setRoomId] = React.useState("");

  const validateRoom = (
    data: Pick<PlayerState, "name" | "avatar">,
    type: "join" | "create"
  ): string => {
    if (!data.name) {
      return "Enter name";
    } else if (!data.avatar) {
      return "Select avatar";
    } else if (type === "join" && !roomId) {
      return "Enter Room ID";
    }

    return "";
  };

  const handleJoinRoom = async () => {
    const data = {
      name: playerName,
      avatar: playerAvatar,
      room_id: roomId,
    };
    const hasError = validateRoom(data, "join");
    if (hasError) {
      window.alert(hasError);
    } else {
      socket.emit("join-room", data);
    }
  };

  const handleCreateRoom = async () => {
    const data = {
      name: playerName,
      avatar: playerAvatar,
    };
    const hasError = validateRoom(data, "create");
    if (hasError) {
      window.alert(hasError);
    } else {
      socket.emit("create-room", data);
    }
  };

  return (
    <div>
      <SearchParamsSetting setRoomId={setRoomId} />
      <div className="flex gap-2">
        <input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          type="text"
          placeholder="Enter Room ID"
          className="block flex-1 placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-pr-text focus:border-pr-text focus:outline-none focus:ring focus:ring-pr-bg focus:ring-opacity-40  "
        />
        <button
          className="p-2 rounded-lg m-auto border border-pr-text text-pr-text hover:bg-pr-text hover:text-pr-bg focus:outline-none "
          onClick={handleJoinRoom}
        >
          <ArrowRightIcon height={24} width={24} />
        </button>
      </div>
      <p className="text-center my-3 font-bold">(OR)</p>
      <button
        className="block rounded mx-auto text-pr-bg bg-pr-text px-8 py-3 focus:outline-none"
        onClick={handleCreateRoom}
      >
        Create Room
      </button>
    </div>
  );
};

export default JoinRoom;
