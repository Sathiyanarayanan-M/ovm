import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import { CHOOSING_WORD } from "@/constants/round";

const initialState: RoundsState = {
  roundNo: 0,
  artist: "",
  hasChosen: false,
  roundStatus: CHOOSING_WORD,
};

export const roundsSlice = createSlice({
  name: "rounds",
  initialState,
  reducers: {
    updateRoundNo: (state, action: PayloadAction<number>) => {
      state.roundNo = action.payload;
    },
    updateArtist: (state, action: PayloadAction<string>) => {
      state.artist = action.payload;
    },
    wordChosen: (state, action: PayloadAction<boolean>) => {
      state.hasChosen = action.payload;
    },
    updateRoundStatus: (state, action: PayloadAction<RoundStatus>) => {
      state.roundStatus = action.payload;
    },
  },
});

export const { updateRoundNo, updateArtist, wordChosen, updateRoundStatus } =
  roundsSlice.actions;

export const selectRound = (state: RootState) => state.rounds;
export const selectArtist = (state: RootState) => state.rounds.artist;
export const selectRoundStatus = (state: RootState) => state.rounds.roundStatus;

export default roundsSlice.reducer;
