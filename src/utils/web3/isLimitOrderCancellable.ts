import { TradeStorageABI } from "./abis/TradeStorage";
import { getPublicClient } from "./clients";
import { contractAddresses } from "./contractAddresses";

export const isLimitOrderCancellable = async (
  chainId: number,
  marketId: `0x${string}`,
  orderKey: `0x${string}`
): Promise<boolean> => {
  const publicClient = getPublicClient(chainId);

  const tradeStorage = contractAddresses[chainId]
    .TRADE_STORAGE as `0x${string}`;

  const [requestResult, cancellationTimeResult] = await publicClient.multicall({
    contracts: [
      {
        address: tradeStorage,
        abi: TradeStorageABI,
        functionName: "getOrder",
        args: [marketId, orderKey],
      },
      {
        address: tradeStorage,
        abi: TradeStorageABI,
        functionName: "minCancellationTime",
        args: [],
      },
    ],
  });

  if (
    requestResult.status === "failure" ||
    cancellationTimeResult.status === "failure"
  ) {
    return false;
  }

  const request = requestResult.result;
  const cancellationTime = cancellationTimeResult.result as bigint;

  const currentTimestamp = Math.round(Date.now() / 1000);

  return (
    currentTimestamp >=
    Number(request.requestTimestamp) + Number(cancellationTime)
  );
};
