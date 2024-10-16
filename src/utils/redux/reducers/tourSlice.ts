import { createSlice } from "@reduxjs/toolkit";

const initialState: { tourModal: "airdrop" | "trade" | null } = {
  tourModal: null,
};

export const tourSlice = createSlice({
  name: "tour",
  initialState,
  reducers: {
    setTourModal: (state, { payload }) => {
      state.tourModal = payload;
    },
  },
});

export const { setTourModal } = tourSlice.actions;

export default tourSlice.reducer;
