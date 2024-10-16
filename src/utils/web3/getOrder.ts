import { TradeStorageABI } from "./abis/TradeStorage";
import { getPublicClient } from "./clients";
import { contractAddresses } from "./contractAddresses";

export const getOrder = async (
  chainId: number,
  marketId: `0x${string}`,
  orderKey: `0x${string}`
) => {
  const publicClient = getPublicClient(chainId);

  return await publicClient.readContract({
    address: contractAddresses[chainId].TRADE_STORAGE as `0x${string}`,
    abi: TradeStorageABI,
    functionName: "getOrder",
    args: [marketId, orderKey],
  });
};
