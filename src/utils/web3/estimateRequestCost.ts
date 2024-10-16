import { PriceFeedABI } from "./abis/PriceFeed";
import { PublicClientType } from "./clients";

/**
 * Oracle.estimateRequestCost relies on tx.gasprice, which we can't set with viem's
 * readContract function.
 *
 * This function is a workaround to estimate the cost of a request to the Oracle contract.
 */
export const estimateRequestCost = async (
  publicClient: PublicClientType,
  priceFeed: `0x${string}`
): Promise<bigint> => {
  const gasPrice = await publicClient.getGasPrice();

  const [gasOverHead, callbackGasLimit] = await publicClient
    .multicall({
      contracts: [
        {
          address: priceFeed,
          abi: PriceFeedABI,
          functionName: "gasOverhead",
        },
        {
          address: priceFeed,
          abi: PriceFeedABI,
          functionName: "callbackGasLimit",
        },
      ],
    })
    .then((results) => results.map((result) => result.result as bigint));

  // Calculate total gas used
  const totalGasUsed = gasOverHead + BigInt(callbackGasLimit);

  // Calculate the base cost
  const baseCost = gasPrice * totalGasUsed;

  // Add a 50% premium fee to the gas estimation
  const premium = baseCost / 2n;

  const cost = baseCost + premium;

  // Double cost - Gas fluctuations causing issues...
  return cost * 2n;
};
