import { UserData } from "../../types/user-types";

export const getUserData = async (account: `0x${string}`) => {
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

  try {
    const userDataResponse = await fetch(`${BACKEND_URL}/user/${account}`, {
      method: "GET",
    });

    const userData: UserData = await userDataResponse.json();

    return userData;
  } catch (error) {
    console.error("Error fetching User Data : ", error);
  }
};

export const getTotalUsers = async () => {
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

  try {
    const totalUsersResponse = await fetch(
      `${BACKEND_URL}/user/total-user-count`,
      {
        method: "GET",
      }
    );

    const totalUsers: number = await totalUsersResponse.json();

    return totalUsers;
  } catch (error) {
    console.error("Error fetching Total User Count : ", error);
  }
};

export const updateUserData = async (
  account: `0x${string}`,
  chainId: number
) => {
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

  try {
    const userUpdateResponse = await fetch(
      `${BACKEND_URL}/xp/update?address=${account}&chainId=${chainId}`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error("Error updating User Data : ", error);
  }
};
