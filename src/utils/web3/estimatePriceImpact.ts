import { contractAddresses } from "./contractAddresses";
import { getPublicClient } from "./clients";
import { MarketABI } from "./abis/Market";
import { PriceImpactABI } from "./abis/PriceImpact";
import { expandDecimals } from "./conversions";

/**
 * - get vault
 * - expand prices to 30 dp bigints
 * - get scalars
 * - call priceImpact.estimate(marketId,address _market,address _vault,int256 _sizeDeltaUsd,uint256 _indexPrice,uint256 _collateralPrice,bool _isLong)
 */

export const estimatePriceImpact = async ({
  chainId,
  marketId,
  sizeDeltaUsd,
  indexPrice,
  collateralPrice,
  isLong,
}: {
  chainId: number;
  marketId: `0x${string}`;
  sizeDeltaUsd: number;
  indexPrice: number;
  collateralPrice: number;
  isLong: boolean;
}) => {
  const publicClient = getPublicClient(chainId);

  const market = contractAddresses[chainId].MARKET as `0x${string}`;

  if (
    !marketId ||
    marketId.length !== 66 ||
    sizeDeltaUsd === 0 ||
    collateralPrice === 0 ||
    indexPrice === 0
  ) {
    return [0n, 0n];
  }

  const vault = await publicClient.readContract({
    address: market,
    abi: MarketABI,
    functionName: "getVault",
    args: [marketId],
  });

  const expandedIndexPrice = expandDecimals(indexPrice, 30);

  const expandedCollateralPrice = expandDecimals(collateralPrice, 30);

  const expandedSizeDeltaUsd = expandDecimals(sizeDeltaUsd, 30);

  const priceImpact = contractAddresses[chainId][
    "PRICE_IMPACT"
  ] as `0x${string}`;

  const priceImpactEstimates = await publicClient.readContract({
    address: priceImpact,
    abi: PriceImpactABI,
    functionName: "estimate",
    args: [
      marketId,
      market,
      vault,
      expandedSizeDeltaUsd,
      expandedIndexPrice,
      expandedCollateralPrice,
      isLong,
    ],
  });

  return priceImpactEstimates;
};
