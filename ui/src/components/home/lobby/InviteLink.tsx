"use client";
import { selectGame } from "@/lib/features/game/gameSlice";
import { useAppSelector } from "@/lib/hooks";
import React from "react";

const InviteLink = () => {
  const currentGame = useAppSelector(selectGame);
  const inviteURL = `${window.origin}?room=${currentGame.roomId}`;
  const handleInvite = () => {
    navigator.clipboard.writeText(inviteURL).then(() => {
      // window.alert("Invite Copied");
    });
  };
  return (
    <div className="bg-white flex justify-between items-center">
      <p className="p-2">{inviteURL}</p>
      <button className="bg-pr-text text-pr-bg p-2" onClick={handleInvite}>
        Invite
      </button>
    </div>
  );
};

export default InviteLink;
