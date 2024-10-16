import { expandDecimals } from "./conversions";
import { MarketABI } from "./abis/Market";
import { MarketUtilsABI } from "./abis/MarketUtils";
import { getPublicClient } from "./clients";
import { contractAddresses } from "./contractAddresses";

export const getAvailableLiquidity = async ({
  chainId,
  marketId,
  indexPrice,
  collateralPrice,
  isLong,
}: {
  chainId: number;
  marketId: `0x${string}`;
  indexPrice: number;
  collateralPrice: number;
  isLong: boolean;
}): Promise<bigint> => {
  if (!marketId || marketId === "0x0000000000000000000000000000000000000000") {
    return 0n;
  }

  const publicClient = getPublicClient(chainId);

  const market = contractAddresses[chainId].MARKET as `0x${string}`;

  if (!marketId || !indexPrice || !collateralPrice) return 0n;

  const vault = await publicClient.readContract({
    address: market,
    abi: MarketABI,
    functionName: "getVault",
    args: [marketId],
  });

  const marketUtils = contractAddresses[chainId][
    "MARKET_UTILS"
  ] as `0x${string}`;

  const expandedIndexPrice = expandDecimals(indexPrice, 30);

  const expandedCollateralPrice = expandDecimals(collateralPrice, 30);

  const availableLiquidity: bigint = await publicClient.readContract({
    address: marketUtils,
    abi: MarketUtilsABI,
    functionName: "getAvailableOiUsd",
    args: [
      marketId,
      market,
      vault,
      expandedIndexPrice,
      expandedCollateralPrice,
      isLong,
    ],
  });

  return availableLiquidity;
};
