import { contractDecimals, expandDecimals } from "./conversions";
import { BorrowingABI } from "./abis/Borrowing";
import { FundingABI } from "./abis/Funding";
import { MarketABI } from "./abis/Market";
import { MarketUtilsABI } from "./abis/MarketUtils";
import { ETH_BASE_UNIT, USDC_BASE_UNIT } from "./config";

import { contractAddresses } from "./contractAddresses";
import { getPublicClient } from "./clients";

export const getMarketStats = async (
  chainId: number,
  marketId: `0x${string}`,
  indexPrice: number,
  ethPrice: number,
  usdcPrice: number
): Promise<{
  borrowRateLong: number;
  borrowRateShort: number;
  fundingRate: number;
  fundingRateVelocity: number;
  availableLiquidityLong: number;
  availableLiquidityShort: number;
  openInterestLong: number;
  openInterestShort: number;
}> => {
  const publicClient = getPublicClient(chainId);

  const market = contractAddresses[chainId].MARKET as `0x${string}`;
  const borrowing = contractAddresses[chainId].BORROWING as `0x${string}`;
  const funding = contractAddresses[chainId].FUNDING as `0x${string}`;
  const marketUtils = contractAddresses[chainId][
    "MARKET_UTILS"
  ] as `0x${string}`;

  const expandedIndexPrice = expandDecimals(indexPrice, 30);
  const expandedLongCollateralPrice = expandDecimals(ethPrice, 30);
  const expandedShortCollateralPrice = expandDecimals(usdcPrice, 30);

  // Fetch first values
  let vault;
  let openInterestLong;
  let openInterestShort;
  let config;
  try {
    [vault, openInterestLong, openInterestShort, config] =
      await publicClient.multicall({
        contracts: [
          {
            address: market,
            abi: MarketABI,
            functionName: "getVault",
            args: [marketId],
          },
          {
            address: market,
            abi: MarketABI,
            functionName: "getOpenInterest",
            args: [marketId, true],
          },
          {
            address: market,
            abi: MarketABI,
            functionName: "getOpenInterest",
            args: [marketId, false],
          },
          {
            address: market,
            abi: MarketABI,
            functionName: "getConfig",
            args: [marketId],
          },
        ],
        allowFailure: false,
      });
  } catch (error) {
    console.error("Error fetching market stats:", error);
    throw error;
  }

  try {
    const [
      borrowRateLong,
      borrowRateShort,
      fundingRate,
      fundingRateVelocity,
      availableLiquidityLong,
      availableLiquidityShort,
    ] = await publicClient.multicall({
      contracts: [
        {
          address: borrowing,
          abi: BorrowingABI,
          functionName: "calculateRate",
          args: [
            marketId,
            market,
            vault,
            expandedLongCollateralPrice,
            ETH_BASE_UNIT,
            true,
          ],
        },
        {
          address: borrowing,
          abi: BorrowingABI,
          functionName: "calculateRate",
          args: [
            marketId,
            market,
            vault,
            expandedShortCollateralPrice,
            USDC_BASE_UNIT,
            false,
          ],
        },
        {
          address: funding,
          abi: FundingABI,
          functionName: "getCurrentFundingRate",
          args: [marketId, market],
        },
        {
          address: funding,
          abi: FundingABI,
          functionName: "getCurrentVelocity",
          args: [
            market,
            openInterestLong - openInterestShort,
            config.maxFundingVelocity,
            config.skewScale,
            openInterestLong + openInterestShort,
          ],
        },
        {
          address: marketUtils,
          abi: MarketUtilsABI,
          functionName: "getAvailableOiUsd",
          args: [
            marketId,
            market,
            vault,
            expandedIndexPrice,
            expandedLongCollateralPrice,
            true,
          ],
        },
        {
          address: marketUtils,
          abi: MarketUtilsABI,
          functionName: "getAvailableOiUsd",
          args: [
            marketId,
            market,
            vault,
            expandedIndexPrice,
            expandedShortCollateralPrice,
            false,
          ],
        },
      ],
      allowFailure: false,
    });

    return {
      borrowRateLong: contractDecimals(borrowRateLong, 18),
      borrowRateShort: contractDecimals(borrowRateShort, 18),
      fundingRate: contractDecimals(fundingRate, 18),
      fundingRateVelocity: contractDecimals(fundingRateVelocity, 18),
      availableLiquidityLong: contractDecimals(availableLiquidityLong, 30),
      availableLiquidityShort: contractDecimals(availableLiquidityShort, 30),
      openInterestLong: contractDecimals(openInterestLong, 30),
      openInterestShort: contractDecimals(openInterestShort, 30),
    };
  } catch (error) {
    console.error("Error fetching market stats:", error);
    throw error;
  }
};
