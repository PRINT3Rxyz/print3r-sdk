import { Position } from "../../types/positions";
import { getPublicClient } from "./clients";
import { TradeStorageABI } from "./abis/TradeStorage";
import { contractAddresses } from "./contractAddresses";

// Use to make sure sizeDelta is exactly 100% in the case of a full position close
export const getStrictPositionSize = async (
  chainId: number,
  position: Position
): Promise<bigint> => {
  const publicClient = getPublicClient(chainId);

  const tradeStorage = contractAddresses[chainId]
    .TRADE_STORAGE as `0x${string}`;

  const fullPosition = await publicClient.readContract({
    address: tradeStorage,
    abi: TradeStorageABI,
    functionName: "getPosition",
    args: [position.marketId, position.positionKey],
  });

  return fullPosition.size;
};
