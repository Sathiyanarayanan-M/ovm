import ArrowRightIcon from "@/components/icons/ArrowRight";
import { IN_GAME } from "@/constants/game";
import { CHOOSING_WORD, DRAWING } from "@/constants/round";
import {
  selectGame,
  selectGamePlayers,
  updatePoints,
} from "@/lib/features/game/gameSlice";
import { selectPlayerId } from "@/lib/features/player/playerSlice";
import { selectRound } from "@/lib/features/rounds/roundsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { socket } from "@/tools/socket";
import React from "react";

const Chats = () => {
  const messageEndRef = React.useRef<HTMLDivElement>(null);
  const [message, setMessage] = React.useState("");
  const [chatList, setChatList] = React.useState<ChatList[]>([]);
  const game = useAppSelector(selectGame);
  const [timer, setTimer] = React.useState(game.duration);
  const dispatch = useAppDispatch();
  const round = useAppSelector(selectRound);
  const gamePlayers = useAppSelector(selectGamePlayers);
  const playerId = useAppSelector(selectPlayerId);
  const timerRef = React.useRef<NodeJS.Timeout>();

  const isArtist = round.artist === playerId;
  const choosingWord = round.roundStatus == CHOOSING_WORD;

  const sendMessage = () => {
    if (round.roundStatus === CHOOSING_WORD && !message) {
      return;
    } else {
      socket.emit("guess", { word: message, d: timer });
      setMessage("");
    }
  };

  const onMessage = (data: OnMessageSocketResp) => {
    console.log("ON_MESSAGE", data);
    const findPlayer = gamePlayers.find((item) => item.id === data.player_id)!;
    const mes: ChatList = {
      message: data.word,
      type: "message",
      name: findPlayer?.name,
    };
    setChatList((prev) => [...prev, mes]);
  };

  const onCorrectGuess = (data: { id: string; points: number }) => {
    const findPlayer = gamePlayers.find((item) => item.id === data.id)!;
    const mes: ChatList = {
      type: "guess",
      name: findPlayer.name,
    };
    setChatList((prev) => [...prev, mes]);
    dispatch(
      updatePoints({
        [data.id]: data.points,
      })
    );
  };

  React.useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chatList]);

  React.useEffect(() => {
    socket.on("correct-guess", onCorrectGuess);
    socket.on("message", onMessage);
    return () => {
      socket.off("correct-guess", onCorrectGuess);
      socket.off("message", onMessage);
    };
  }, []);

  React.useEffect(() => {
    if (round.roundStatus === DRAWING && game.gameStatus === IN_GAME) {
      if (timer === 0 && isArtist) {
        socket.emit("time-up");
        return;
      }

      timerRef.current = setInterval(() => {
        if (timer > 0) {
          setTimer((prevSeconds) => prevSeconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timer, round.roundStatus, game.gameStatus]);

  React.useEffect(() => {
    setTimer(game.duration);
  }, [round.artist, game.duration, game.gameStatus]);

  return (
    <div className="p-2 flex flex-col gap-3 relative min-h-full">
      {!choosingWord && (
        <div className="sticky top-2 shadow text-xl h-fit text-center bg-white">
          {timer}
        </div>
      )}
      {chatList.map((item, idx) => (
        <div
          className="flex items-center justify-between gap-2 bg-red-100 first:mt-7 last:mb-7"
          key={idx}
        >
          {item.type === "message" ? (
            <>
              <p className="font-bold break-all">{item.name}</p>
              <p className="wrap break-all text-sm">{item.message}</p>
            </>
          ) : (
            <p className="text-green-700 font-bold truncate">{`${item.name} guessed the word`}</p>
          )}
        </div>
      ))}
      <div ref={messageEndRef} />
      {!isArtist && (
        <div className="h-10 sticky bottom-2 mt-auto flex items-center justify-between gap-2 shadow ">
          <input
            type="text"
            className="h-8 flex-1 rounded focus:outline-none p-1 border border-pr-text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            disabled={round.roundStatus === CHOOSING_WORD}
          />
          <button
            className="p-1.5 rounded-lg border border-pr-text bg-pr-text text-pr-bg focus:outline-none "
            onClick={sendMessage}
          >
            <ArrowRightIcon height={20} width={20} />
          </button>
        </div>
      )}
    </div>
  );
};

type ChatList = {
  type: "message" | "guess";
  message?: string;
  name: string;
};

export default Chats;
