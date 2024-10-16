import { zeroHash } from "viem";
import { TradeStorageABI } from "./abis/TradeStorage";
import { getPublicClient } from "./clients";
import { contractAddresses } from "./contractAddresses";

export const checkHasTriggers = async ({
  chainId,
  marketId,
  ticker,
  user,
  isLong,
}: {
  chainId: number;
  marketId: `0x${string}`;
  ticker: string;
  user: `0x${string}`;
  isLong: boolean;
}): Promise<{ hasStopLoss: boolean; hasTakeProfit: boolean }> => {
  const publicClient = getPublicClient(chainId);

  const tradeStorage = contractAddresses[chainId]
    .TRADE_STORAGE as `0x${string}`;

  const position = await publicClient.readContract({
    address: tradeStorage,
    abi: TradeStorageABI,
    functionName: "getPosition",
    args: [marketId, ticker, user, isLong],
  });

  let hasStopLoss = false;
  let hasTakeProfit = false;

  if (position.stopLossKey !== zeroHash) {
    hasStopLoss = true;
  }

  if (position.takeProfitKey !== zeroHash) {
    hasTakeProfit = true;
  }

  return { hasStopLoss, hasTakeProfit };
};
