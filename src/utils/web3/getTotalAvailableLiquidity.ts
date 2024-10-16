import { getPublicClient } from "./clients";
import { contractAddresses } from "./contractAddresses";
import { MarketABI } from "./abis/Market";
import { VaultABI } from "./abis/Vault";

export const getTotalAvailableLiquidity = async (
  chainId: number,
  marketId: `0x${string}`
): Promise<{ eth: bigint; usdc: bigint }> => {
  if (!chainId || !marketId) {
    return { eth: 0n, usdc: 0n };
  }

  const publicClient = getPublicClient(chainId);

  const market = contractAddresses[chainId].MARKET as `0x${string}`;

  const vault = await publicClient.readContract({
    address: market,
    abi: MarketABI,
    functionName: "getVault",
    args: [marketId],
  });

  const [
    totalAvailableLiquidityLongResult,
    totalAvailableLiquidityShortResult,
  ] = await publicClient.multicall({
    contracts: [
      {
        address: vault,
        abi: VaultABI,
        functionName: "totalAvailableLiquidity",
        args: [true],
      },
      {
        address: vault,
        abi: VaultABI,
        functionName: "totalAvailableLiquidity",
        args: [false],
      },
    ],
  });

  if (
    totalAvailableLiquidityLongResult.status === "failure" ||
    totalAvailableLiquidityShortResult.status === "failure"
  ) {
    throw new Error("One or more multicall requests failed");
  }

  const totalAvailableLiquidityLong =
    totalAvailableLiquidityLongResult.result as bigint;
  const totalAvailableLiquidityShort =
    totalAvailableLiquidityShortResult.result as bigint;

  return {
    eth: totalAvailableLiquidityLong,
    usdc: totalAvailableLiquidityShort,
  };
};
