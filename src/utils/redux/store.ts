import { configureStore } from "@reduxjs/toolkit";

import tourSlice from "./reducers/tourSlice";
import userSlice from "./reducers/userSlice";
import leaderBoardSlice from "./reducers/leaderBoardSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      tourSlice: tourSlice,
      userSlice: userSlice,
      leaderBoardSlice: leaderBoardSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
