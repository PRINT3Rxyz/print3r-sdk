import { ActivityData, LeaderBoardResponse } from "../../types/xp-types";

export const getLeaderBoardData = async (account: `0x${string}`) => {
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

  try {
    const leaderboardDataResponse = await fetch(
      `${BACKEND_URL}/xp/leaderboard-data?address=${account}`,
      {
        method: "GET",
      }
    );

    const leaderBoardData: LeaderBoardResponse =
      await leaderboardDataResponse.json();

    return leaderBoardData;
  } catch (error) {
    console.error("Error fetching LeaderBoard Data : ", error);
  }
};

export const getActivityBreakDown = async (
  account: `0x${string}`,
  chainId: number
) => {
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

  try {
    const userActivityBreakDownResponse = await fetch(
      `${BACKEND_URL}/xp/user-activity-breakdown?address=${account}&chainId=${chainId}`,
      {
        method: "GET",
      }
    );

    let userActivityBreakDown: ActivityData =
      await userActivityBreakDownResponse.json();

    return userActivityBreakDown;
  } catch (error) {
    console.error("Error updating User Data : ", error);
  }
};
