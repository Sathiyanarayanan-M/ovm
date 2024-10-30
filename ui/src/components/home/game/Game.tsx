import React from "react";
import Players from "./Players";
import Chats from "./Chats";
import dynamic from "next/dynamic";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  selectRound,
  updateArtist,
  updateRoundNo,
  updateRoundStatus,
  wordChosen,
} from "@/lib/features/rounds/roundsSlice";
import { selectPlayerId } from "@/lib/features/player/playerSlice";
import { CHOOSING_WORD, DRAWING } from "@/constants/round";
import Backdrop from "@/components/common/Backdrop";
import { socket } from "@/tools/socket";
import {
  removePlayer,
  selectGamePlayers,
  updateGameStatus,
  updatePoints,
} from "@/lib/features/game/gameSlice";
import { GAME_OVER } from "@/constants/game";

const ChosenWord = dynamic(() => import("./ChoseWord"));
const PointsTable = dynamic(() => import("./PointsTable"));
const CanvasContainer = dynamic(() => import("./CanvasContainer"), {
  ssr: false,
});

const Game = () => {
  const [gameOver, setGameOver] = React.useState(false);
  const dispatch = useAppDispatch();
  const round = useAppSelector(selectRound);
  const playerId = useAppSelector(selectPlayerId);
  const players = useAppSelector(selectGamePlayers);
  const isArtist = round.artist === playerId;
  const choosingWord = round.roundStatus == CHOOSING_WORD;
  const artistDetails = players.find((item) => item.id! === round.artist);

  React.useEffect(() => {
    const onGameOver = (data: GameOverResp) => {
      setGameOver(true);
      const pointsData = data.reduce(
        (prev, cur) => ({ ...prev, [cur["id"]]: cur["points"] }),
        {}
      ) as Record<string, number>;
      dispatch(updatePoints(pointsData));
      dispatch(updateGameStatus(GAME_OVER));
    };

    const onChoseWord = () => {
      dispatch(updateRoundStatus(DRAWING));
      dispatch(wordChosen(true));
    };

    const onPlayerLeft = (id: string) => {
      dispatch(removePlayer(id));
    };

    const nextPlayer = (data: NextPlayerSocketResp) => {
      dispatch(updateRoundNo(data["round_no"]));
      dispatch(updateArtist(data["artist"]));
      dispatch(updateRoundStatus(CHOOSING_WORD));
    };

    socket.on("choose-word", onChoseWord);
    socket.on("game-over", onGameOver);
    socket.on("player-left", onPlayerLeft);
    socket.on("next-player", nextPlayer);

    return () => {
      socket.off("game-over", onGameOver);
      socket.off("choose-word", onChoseWord);
      socket.off("player-left", onPlayerLeft);
      socket.off("next-player", nextPlayer);
    };
  }, []);

  return (
    <div className="p-4 flex gap-3 h-screen-nav md:flex-col md:h-full md:overflow-auto">
      <div className="border bg-red-100 basis-1/4 overflow-auto rounded">
        <Players />
      </div>
      <div
        className={`border flex-1 rounded ${
          choosingWord || gameOver
            ? "relative overflow-hidden"
            : "overflow-auto "
        } `}
      >
        {choosingWord && (
          <Backdrop>
            {isArtist ? (
              <ChosenWord />
            ) : (
              <p className="absolute m-auto left-0 right-0 text-center">
                {`${artistDetails?.name} choosing word`}
              </p>
            )}
          </Backdrop>
        )}
        {gameOver && (
          <Backdrop>
            <PointsTable />
          </Backdrop>
        )}

        <CanvasContainer />
      </div>
      <div className="border bg-red-100 basis-1/4 overflow-auto rounded">
        <Chats />
      </div>
    </div>
  );
};

export default Game;
