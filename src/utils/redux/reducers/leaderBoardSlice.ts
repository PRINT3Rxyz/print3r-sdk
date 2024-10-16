import { createSlice } from "@reduxjs/toolkit";
import { UserData } from "../../../types/user-types";
import { LeaderBoardResponse } from "../../../types/xp-types";

const initialState: {
  leaderBoardData: LeaderBoardResponse | null;
  totalUsers: number | null;
} = {
  leaderBoardData: null,
  totalUsers: null,
};

export const leaderBoardSlice = createSlice({
  name: "leaderBoard",
  initialState,
  reducers: {
    setLeaderBoardData: (state, { payload }) => {
      state.leaderBoardData = payload;
    },
    setTotalUsers: (state, { payload }) => {
      state.totalUsers = payload;
    },
  },
});

export const { setLeaderBoardData, setTotalUsers } = leaderBoardSlice.actions;

export default leaderBoardSlice.reducer;
