import { TradeStorageABI } from "./abis/TradeStorage";
import { getPublicClient } from "./clients";
import { contractAddresses } from "./contractAddresses";

export const getPosition = async (
  chainId: number,
  marketId: `0x${string}`,
  positionKey: `0x${string}`
) => {
  const publicClient = getPublicClient(chainId);

  return await publicClient.readContract({
    address: contractAddresses[chainId].TRADE_STORAGE as `0x${string}`,
    abi: TradeStorageABI,
    functionName: "getPosition",
    args: [marketId, positionKey],
  });
};
