import { MarketABI } from "./abis/Market";
import { RewardTrackerABI } from "./abis/RewardTracker";
import { getPublicClient } from "./clients";
import { contractAddresses } from "./contractAddresses";

export const getRewardTrackerBalance = async (
  chainId: number,
  account: `0x${string}`,
  marketId: `0x${string}`
): Promise<bigint> => {
  if (!marketId || marketId.length !== 66) return 0n;

  const publicClient = getPublicClient(chainId);

  const market = contractAddresses[chainId].MARKET as `0x${string}`;

  const rewardTracker = await publicClient.readContract({
    address: market,
    abi: MarketABI,
    functionName: "getRewardTracker",
    args: [marketId],
  });

  const balance = (await publicClient.readContract({
    address: rewardTracker,
    abi: RewardTrackerABI,
    functionName: "balanceOf",
    args: [account],
  })) as bigint;

  return balance;
};
