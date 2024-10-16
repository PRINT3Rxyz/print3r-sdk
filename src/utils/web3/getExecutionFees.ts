import { PositionManagerABI } from "./abis/PositionManager";
import { getPublicClient } from "./clients";
import { contractAddresses } from "./contractAddresses";
import { estimateRequestCost } from "./estimateRequestCost";

export const getExecutionFees = async (
  chainId: number,
  action: "deposit" | "withdrawal" | "position",
  limitNumber: number
): Promise<[bigint, bigint]> => {
  const publicClient = getPublicClient(chainId);

  const positionManager = contractAddresses[chainId][
    "POSITION_MANAGER"
  ] as `0x${string}`;

  const priceFeed = contractAddresses[chainId].PRICE_FEED as `0x${string}`;

  let actionCost = 0n;

  if (action === "deposit") {
    actionCost = await publicClient.readContract({
      address: positionManager,
      abi: PositionManagerABI,
      functionName: "averageDepositCost",
    });
  } else if (action === "withdrawal") {
    actionCost = await publicClient.readContract({
      address: positionManager,
      abi: PositionManagerABI,
      functionName: "averageWithdrawalCost",
    });
  } else if (action === "position") {
    // Limits = 0, 1 or 2
    let singleActionCost = await publicClient.readContract({
      address: positionManager,
      abi: PositionManagerABI,
      functionName: "averagePositionCost",
    });

    // We do + then multiply, so if actionCost is x and limitNumber is 1, we get x + x = 2x instead of x * 1 = x
    actionCost =
      limitNumber > 0
        ? singleActionCost + singleActionCost * BigInt(limitNumber)
        : singleActionCost;
  }

  const priceUpdateCost = await estimateRequestCost(publicClient, priceFeed);

  // 10% buffer
  actionCost = (actionCost * 11n) / 10n;

  return [actionCost, priceUpdateCost];
};
