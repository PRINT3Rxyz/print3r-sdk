import { zeroAddress } from "viem";
import { MarketABI } from "./abis/Market";
import { VaultABI } from "./abis/Vault";
import { getPublicClient } from "./clients";
import { contractAddresses } from "./contractAddresses";

export const getDetailsForMarket = async (
  chainId: number,
  marketId: `0x${string}`
) => {
  const publicClient = getPublicClient(chainId);

  const market = contractAddresses[chainId].MARKET as `0x${string}`;

  if (!marketId || marketId.length !== 66) {
    return {
      ticker: "",
      poolSymbol: "",
      rewardTracker: zeroAddress,
    };
  }

  const [ticker, vault, rewardTracker] = await publicClient
    .multicall({
      contracts: [
        {
          address: market,
          abi: MarketABI,
          functionName: "getTicker",
          args: [marketId],
        },
        {
          address: market,
          abi: MarketABI,
          functionName: "getVault",
          args: [marketId],
        },
        {
          address: market,
          abi: MarketABI,
          functionName: "getRewardTracker",
          args: [marketId],
        },
      ],
    })
    .then((results) => results.map((result) => result.result));

  if (!ticker || !vault || !rewardTracker) {
    return {
      ticker: "",
      poolSymbol: "",
      rewardTracker: zeroAddress,
    };
  }

  const vaultAddress = vault as `0x${string}`;

  const symbol = await publicClient.readContract({
    address: vaultAddress,
    abi: VaultABI,
    functionName: "symbol",
    args: [],
  });

  // Return the ticker and vault name
  return {
    ticker: ticker,
    poolSymbol: symbol,
    rewardTracker: rewardTracker as `0x${string}`,
  };
};
