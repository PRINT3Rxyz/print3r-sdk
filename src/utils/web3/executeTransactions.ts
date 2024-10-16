import { encodeFunctionData } from "viem";
import { BiconomySmartAccountV2, UserOpReceipt } from "@biconomy/account";

type BatchWriteParams = {
  transactions: {
    address: `0x${string}`;
    abi: any;
    functionName: string;
    args?: any[];
    value?: bigint;
  }[];
  nonceOptions?: { nonceKey: number };
};

export const executeTransactions = async ({
  transactions,
  smartAccount,
  nonceOptions,
}: BatchWriteParams & {
  smartAccount: BiconomySmartAccountV2;
  nonceOptions?: { nonceKey: number };
}): Promise<UserOpReceipt[]> => {
  if (!smartAccount) {
    throw new Error("Smart account is required");
  }

  try {
    const txs = transactions.map((tx) => ({
      to: tx.address,
      data: encodeFunctionData({
        abi: tx.abi,
        functionName: tx.functionName,
        args: tx.args || [],
      }),
      value: tx.value || 0n,
    }));

    const { wait } = await smartAccount.sendTransaction(txs, { nonceOptions });

    const receipt = await wait();

    if (!receipt.success) {
      throw new Error("Transaction failed with reason: " + receipt.reason);
    }

    return [receipt];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
