"use client";
import React from "react";
import {
  DEFAULT_LANGUAGE,
  DEFAULT_PLAYERS,
  DEFAULT_ROUNDS,
  DEFAULT_TIME,
  LANGUAGES,
  MAX_PLAYERS,
  MAX_ROUNDS,
  MAX_TIME,
  MIN_PLAYERS,
  MIN_ROUNDS,
  MIN_TIME,
} from "@/constants/settings";
import Counter from "@/components/common/Counter";
import { updateGameStatus } from "@/lib/features/game/gameSlice";
import { IN_GAME } from "@/constants/game";
import { useAppDispatch } from "@/lib/hooks";
import { socket } from "@/tools/socket";

const Settings = () => {
  const dispatch = useAppDispatch();
  const [settings, setSettings] = React.useState<SettingsState>({
    language: DEFAULT_LANGUAGE,
    duration: DEFAULT_TIME,
    rounds: DEFAULT_ROUNDS,
  });

  const handleChangeSettings = (data: Partial<SettingsState>) => {
    setSettings((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const validate = () => {
    return "";
  };

  const onStart = () => {
    const hasError = validate();

    if (hasError) {
      window.alert(hasError);
    } else {
      socket.emit("start-game", settings);
    }
  };

  return (
    <div className="p-4 flex gap-8 flex-col">
      {/* <Counter
        value={settings.players}
        maxValue={MAX_PLAYERS}
        minValue={MIN_PLAYERS}
        onChange={(value) =>
          handleChangeSettings({
            players: value,
          })
        }
        title="Players"
      /> */}

      <div className="flex items-center justify-between gap-1">
        <p>Language</p>
        <select
          className=" w-1/2 h-10 rounded-lg border-gray-300 text-gray-700 sm:text-sm ring-0 outline-none"
          onChange={(e) => handleChangeSettings({ language: e.target.value })}
          value={settings.language}
        >
          {LANGUAGES.map((item, idx) => (
            <option value={item.code} key={idx}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <Counter
        value={settings.duration}
        incrementBy={10}
        maxValue={MAX_TIME}
        minValue={MIN_TIME}
        onChange={(value) =>
          handleChangeSettings({
            duration: value,
          })
        }
        title="Duration"
      />
      <Counter
        value={settings.rounds}
        maxValue={MAX_ROUNDS}
        minValue={MIN_ROUNDS}
        onChange={(value) =>
          handleChangeSettings({
            rounds: value,
          })
        }
        title="Rounds"
      />

      <button
        className="rounded mt-auto min-h-[50px] group relative overflow-hidden border border-pr-text px-8 py-3 focus:outline-none"
        onClick={onStart}
      >
        <span className="absolute inset-y-0 left-0 w-[2px] bg-pr-text transition-all group-hover:w-full group-active:bg-pr-text"></span>

        <span className="relative text-base font-medium text-pr-text transition-colors group-hover:text-white">
          Start
        </span>
      </button>
    </div>
  );
};

export default Settings;
