import { PositionManagerABI } from "./abis/PositionManager";
import { contractAddresses } from "./contractAddresses";
import { Order } from "../../types/positions";
import { executeTransactions } from "./executeTransactions";
import { zeroAddress } from "viem";
import { BiconomySmartAccountV2 } from "@biconomy/account";

export const cancelLimitOrder = async (
  chainId: number,
  account: `0x${string}`,
  order: Order,
  smartAccount: BiconomySmartAccountV2
): Promise<`0x${string}`> => {
  const positionManager = contractAddresses[chainId]
    .POSITION_MANAGER as `0x${string}`;

  const tx = {
    account,
    address: positionManager,
    abi: PositionManagerABI,
    functionName: "cancelOrderRequest",
    args: [order.marketId, order.orderKey, true],
  };

  const transactions = [tx];

  try {
    const receipts = await executeTransactions({ transactions, smartAccount });

    let errors: string[] = [];

    receipts.forEach((receipt: any) => {
      if (!receipt.success) {
        errors.push(`Failed receipt for position manager: ${receipt.reason}`);
      }
    });

    if (errors.length > 0) {
      throw new Error(`Failed to cancel limit order: ${errors.join("\n")}`);
      return zeroAddress;
    }

    return receipts[0].userOpHash as `0x${string}`;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to cancel limit order: ${error}`);
  }
};
