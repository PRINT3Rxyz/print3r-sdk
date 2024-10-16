import { expandDecimals } from "../../utils/web3/conversions";
import { MarketUtilsABI } from "./abis/MarketUtils";
import { contractAddresses } from "./contractAddresses";
import { BorrowingABI } from "./abis/Borrowing";
import { MarketABI } from "./abis/Market";
import { getPublicClient } from "./clients";

export const getLpTokenPrice = async (
  chainId: number,
  marketId: `0x${string}`,
  ethPrice: number,
  usdcPrice: number
): Promise<bigint> => {
  if (!marketId || marketId === "0x") return 0n;

  const publicClient = getPublicClient(chainId);

  const scaledEthPrice = expandDecimals(ethPrice, 30);
  const scaledUsdcPrice = expandDecimals(usdcPrice, 30);

  const market: `0x${string}` = contractAddresses[chainId]
    .MARKET as `0x${string}`;

  const borrowing: `0x${string}` = contractAddresses[chainId]
    .BORROWING as `0x${string}`;

  const marketUtils = contractAddresses[chainId].MARKET_UTILS as `0x${string}`;

  if (!marketId || marketId.length !== 66) {
    return 0n;
  }

  const multicallResults = await publicClient.multicall({
    contracts: [
      {
        address: market,
        abi: MarketABI,
        functionName: "getVault",
        args: [marketId],
      },
      {
        address: borrowing,
        abi: BorrowingABI,
        functionName: "getTotalFeesOwedForAsset",
        args: [marketId, market, true],
      },
      {
        address: borrowing,
        abi: BorrowingABI,
        functionName: "getTotalFeesOwedForAsset",
        args: [marketId, market, false],
      },
    ],
  });

  const [vaultResult, longBorrowFeesUsdResult, shortBorrowFeesUsdResult] =
    multicallResults;

  // Add null checks and type assertions
  if (
    vaultResult.status === "failure" ||
    longBorrowFeesUsdResult.status === "failure" ||
    shortBorrowFeesUsdResult.status === "failure"
  ) {
    throw new Error("One or more multicall requests failed");
  }

  const vault = vaultResult.result as `0x${string}`;
  const longBorrowFeesUsd = longBorrowFeesUsdResult.result as bigint;
  const shortBorrowFeesUsd = shortBorrowFeesUsdResult.result as bigint;

  const cumulativePnl = 0n;

  const lpTokenPrice = await publicClient.readContract({
    address: marketUtils,
    abi: MarketUtilsABI,
    functionName: "getMarketTokenPrice",
    args: [
      vault,
      scaledEthPrice,
      longBorrowFeesUsd,
      scaledUsdcPrice,
      shortBorrowFeesUsd,
      cumulativePnl,
    ],
  });

  return lpTokenPrice;
};
