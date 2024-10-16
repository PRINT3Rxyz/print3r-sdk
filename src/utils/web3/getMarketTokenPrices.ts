import { getChainlinkFeed } from "./secondaryFeeds";
import { getPublicClient } from "./clients";
import { ChainlinkABI } from "./abis/Chainlink";
import { contractDecimals } from "./conversions";

/**
 * Get the price of ETH / USDC from Chainlink feeds.
 */
export const getMarketTokenPrices = async (): Promise<{
  ethPrice: number;
  usdcPrice: number;
}> => {
  // Default to Base, as not every chain supports Chainlink price feeds.
  const chainId = 84532;

  const publicClient = getPublicClient(chainId);

  const ethPriceFeed = getChainlinkFeed(chainId, "ETH");

  const usdcPriceFeed = getChainlinkFeed(chainId, "USDC");

  if (!ethPriceFeed || !usdcPriceFeed)
    return {
      ethPrice: 0,
      usdcPrice: 0,
    };

  const [ethPrice, usdcPrice] = await publicClient
    .multicall({
      contracts: [
        {
          address: ethPriceFeed,
          abi: ChainlinkABI,
          functionName: "latestAnswer",
        },
        {
          address: usdcPriceFeed,
          abi: ChainlinkABI,
          functionName: "latestAnswer",
        },
      ],
    })
    .then((results: any) => results.map((result: any) => result.result));

  if (!ethPrice || !usdcPrice)
    return {
      ethPrice: 0,
      usdcPrice: 0,
    };

  // Chainlink prices have 8 decimals, so we need to / 1e8 to get the float value
  const ethPriceFloat = contractDecimals(ethPrice, 8);
  const usdcPriceFloat = contractDecimals(usdcPrice, 8);

  return {
    ethPrice: ethPriceFloat,
    usdcPrice: usdcPriceFloat,
  };
};
