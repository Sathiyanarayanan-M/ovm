import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import { HOME_SCREEN } from "@/constants/game";
import { DEFAULT_ROUNDS, DEFAULT_TIME } from "@/constants/settings";

const initialState: GameState = {
  players: [],
  roomId: "",
  gameStatus: HOME_SCREEN,
  admin: "",
  rounds: DEFAULT_ROUNDS,
  // startTime: "",
  // endTime: "",
  duration: DEFAULT_TIME,
  language: "EN",
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    addPlayer: (state, action: PayloadAction<PlayerState>) => {
      state.players = [...state.players, action.payload];
    },
    removePlayer: (state, action: PayloadAction<string>) => {
      state.players = state.players.filter(
        (item) => item.id !== action.payload
      );
    },
    initPlayers: (state, action: PayloadAction<GameState["players"]>) => {
      state.players = action.payload;
    },
    updatePoints: (state, action: PayloadAction<Record<string, number>>) => {
      const playersMap = state.players.map((item) => ({
        ...item,
        points: action.payload[item.id!] || item.points,
      }));
      state.players = playersMap;
    },
    updateRoomId: (state, action: PayloadAction<GameState["roomId"]>) => {
      state.roomId = action.payload;
    },
    updateGameStatus: (
      state,
      action: PayloadAction<GameState["gameStatus"]>
    ) => {
      state.gameStatus = action.payload;
    },
    updateAdmin: (state, action: PayloadAction<GameState["admin"]>) => {
      state.admin = action.payload;
    },
    updateGameSettings: (state, action: PayloadAction<FinalGameState>) => {
      state = Object.assign(state, action.payload);
    },
  },
});

export const {
  addPlayer,
  updateRoomId,
  updateGameStatus,
  updateAdmin,
  initPlayers,
  updateGameSettings,
  updatePoints,
  removePlayer,
} = gameSlice.actions;

export const selectGame = (state: RootState) => state.game;
export const selectGameRoomId = (state: RootState) => state.game.roomId;
export const selectGamePlayers = (state: RootState) => state.game.players;
export const selectGameStatus = (state: RootState) => state.game.gameStatus;

export default gameSlice.reducer;
