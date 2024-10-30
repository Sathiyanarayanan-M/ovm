import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

const initialState: PlayerState = {
  name: "",
  avatar: "",
  id: "",
  points: 0,
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    updatePlayerName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    updatePlayerAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },
    updatePlayerId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
  },
});

export const { updatePlayerName, updatePlayerAvatar, updatePlayerId } =
  playerSlice.actions;

export const selectPlayerName = (state: RootState) => state.player.name;
export const selectPlayerAvatar = (state: RootState) => state.player.avatar;
export const selectPlayerId = (state: RootState) => state.player.id;
export const selectPlayer = (state: RootState) => state.player;

export default playerSlice.reducer;
