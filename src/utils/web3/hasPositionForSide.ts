import { zeroAddress, zeroHash } from "viem";
import { TradeStorageABI } from "./abis/TradeStorage";
import { getPublicClient } from "./clients";
import { contractAddresses } from "./contractAddresses";

export const hasPositionForSide = async (
  chainId: number,
  marketId: `0x${string}`,
  customId: string,
  account: `0x${string}`,
  isLong: boolean
): Promise<boolean> => {
  if (marketId === zeroHash || account === zeroAddress) {
    return false;
  }

  const publicClient = getPublicClient(chainId);

  const tradeStorage = contractAddresses[chainId]
    .TRADE_STORAGE as `0x${string}`;

  const position = await publicClient.readContract({
    address: tradeStorage,
    abi: TradeStorageABI,
    functionName: "getPosition",
    args: [marketId, customId, account, isLong],
  });

  if (position.size === 0n) {
    return false;
  }

  return true;
};
