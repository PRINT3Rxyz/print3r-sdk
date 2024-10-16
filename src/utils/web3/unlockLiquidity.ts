import { BiconomySmartAccountV2 } from "@biconomy/account";
import { MarketABI } from "./abis/Market";
import { RewardTrackerABI } from "./abis/RewardTracker";
import { getPublicClient } from "./clients";
import { getChainFromChainId } from "./config";
import { contractAddresses } from "./contractAddresses";
import { executeTransactions } from "./executeTransactions";

export const unlockLiquidity = async (
  chainId: number,
  account: `0x${string}`,
  marketId: `0x${string}`,
  lockKeys: `0x${string}`[],
  smartAccount: BiconomySmartAccountV2
) => {
  const publicClient = getPublicClient(chainId);

  const market = contractAddresses[chainId].MARKET as `0x${string}`;

  const rewardTracker = await publicClient.readContract({
    address: market,
    abi: MarketABI,
    functionName: "getRewardTracker",
    args: [marketId],
  });

  const chain = getChainFromChainId(chainId);

  const tx = {
    account: account,
    abi: RewardTrackerABI,
    address: rewardTracker,
    functionName: "unlock",
    args: [lockKeys],
    chain: chain,
  };

  const transactions = [tx];

  try {
    const receipts = await executeTransactions({ transactions, smartAccount });

    let errors: string[] = [];

    receipts.forEach((receipt: any) => {
      if (!receipt.success) {
        errors.push(`Failed receipt for reward tracker: ${receipt.reason}`);
      }
    });

    if (errors.length > 0) {
      throw new Error(`Failed to unlock liquidity: ${errors.join("\n")}`);
    }
  } catch (error) {
    throw new Error(`Failed to unlock liquidity: ${error}`);
  }
};
