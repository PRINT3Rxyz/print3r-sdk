import { contractDecimals, expandDecimals } from "./conversions";
import { MarketABI } from "./abis/Market";
import { TradeStorageABI } from "./abis/TradeStorage";
import { getPublicClient } from "./clients";
import { contractAddresses } from "./contractAddresses";
import { PositionABI } from "./abis/Position";
import { PriceImpactABI } from "./abis/PriceImpact";

export const getClosePositionFees = async (
  chainId: number,
  marketId: `0x${string}`,
  positionKey: `0x${string}`,
  sizeDeltaUsd: number,
  indexPrice: number,
  isLong: boolean,
  collateralPrice: number
): Promise<{
  fundingFee: number;
  borrowFee: number;
  priceImpact: number;
}> => {
  const publicClient = getPublicClient(chainId);

  const market = contractAddresses[chainId].MARKET as `0x${string}`;

  const tradeStorage = contractAddresses[chainId][
    "TRADE_STORAGE"
  ] as `0x${string}`;

  const position = contractAddresses[chainId].POSITION as `0x${string}`;

  const priceImpact = contractAddresses[chainId][
    "PRICE_IMPACT"
  ] as `0x${string}`;

  const [vault, positionData] = await publicClient.multicall({
    contracts: [
      {
        address: market,
        abi: MarketABI,
        functionName: "getVault",
        args: [marketId],
      },
      {
        address: tradeStorage,
        abi: TradeStorageABI,
        functionName: "getPosition",
        args: [marketId, positionKey],
      },
    ],
    allowFailure: false,
  });

  const expandedIndexPrice = expandDecimals(indexPrice, 30);

  const expandedSizeDelta = expandDecimals(sizeDeltaUsd, 30);

  const expandedCollateralPrice = expandDecimals(collateralPrice, 30);

  try {
    const [fees, impact] = await publicClient.multicall({
      contracts: [
        {
          address: position,
          abi: PositionABI,
          functionName: "getFeesForKey",
          args: [marketId, tradeStorage, market, positionKey],
        },
        {
          address: priceImpact,
          abi: PriceImpactABI,
          functionName: "estimate",
          args: [
            marketId,
            market,
            vault,
            expandedSizeDelta,
            expandedIndexPrice,
            expandedCollateralPrice,
            positionData.isLong,
          ],
        },
      ],
      allowFailure: false,
    });

    const contractedFunding = contractDecimals(fees[0], 30);

    const contractedBorrowing = contractDecimals(fees[1], 30);

    const contractedImpact = contractDecimals(impact[0], 30);

    return {
      fundingFee: contractedFunding,
      borrowFee: contractedBorrowing,
      priceImpact: contractedImpact,
    };
  } catch (error) {
    console.error("Error fetching fees: ", error);
    throw error;
  }
};
