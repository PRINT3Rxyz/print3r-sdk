import { createSlice } from "@reduxjs/toolkit";
import { UserData } from "../../../types/user-types";

const initialState: { userData: UserData | null } = {
  userData: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, { payload }) => {
      state.userData = payload;
    },
  },
});

export const { setUserData } = userSlice.actions;

export default userSlice.reducer;
