import { configureStore } from "@reduxjs/toolkit";
import playerSlice from "./features/player/playerSlice";
import gameSlice from "./features/game/gameSlice";
import roundsSlice from "./features/rounds/roundsSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      player: playerSlice,
      game: gameSlice,
      rounds: roundsSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
