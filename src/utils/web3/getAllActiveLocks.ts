import { MarketABI } from "./abis/Market";
import { RewardTrackerABI } from "./abis/RewardTracker";
import { getPublicClient } from "./clients";
import { contractAddresses } from "./contractAddresses";

type Lock = {
  depositAmount: bigint;
  lockedAt: number;
  unlockDate: number;
  owner: `0x${string}`;
  lockKey: `0x${string}`;
};

export const getAllActiveLocks = async (
  chainId: number,
  account: `0x${string}`,
  marketId: `0x${string}`
): Promise<Lock[]> => {
  const publicClient = getPublicClient(chainId);

  const market = contractAddresses[chainId].MARKET as `0x${string}`;

  const rewardTracker = await publicClient.readContract({
    address: market,
    abi: MarketABI,
    functionName: "getRewardTracker",
    args: [marketId],
  });

  const allLocks = await publicClient.readContract({
    address: rewardTracker,
    abi: RewardTrackerABI,
    functionName: "getActiveLocks",
    args: [account],
  });

  const lockKeysCalls = allLocks.map((_, index) => ({
    address: rewardTracker,
    abi: RewardTrackerABI,
    functionName: "getLockKeyAtIndex",
    args: [account, BigInt(index)],
  }));

  // @ts-ignore
  const lockKeys = (await publicClient.multicall({
    contracts: lockKeysCalls,
  })) as { result: `0x${string}` }[];

  const locks: Lock[] = allLocks.map((lockData, index) => ({
    depositAmount: lockData.depositAmount,
    lockedAt: lockData.lockedAt,
    unlockDate: lockData.unlockDate,
    owner: lockData.owner,
    lockKey: lockKeys[index].result as `0x${string}`,
  }));

  return locks;
};
