import { parseEventLogs } from "viem";
import { RouterABI } from "./abis/Router";
import { getPublicClient, PublicClientType } from "./clients";

type EventConfig = {
  contractAddress: `0x${string}`;
  abi: any;
  eventName: string;
  event: any;
  args: Record<string, any>;
};

export const waitForExecution = async (
  chainId: number,
  eventConfig: EventConfig,
  txHash?: `0x${string}`
) => {
  console.log("Waiting for execution...");

  const publicClient = getPublicClient(chainId);

  try {
    let orderKey: `0x${string}` | undefined;

    // For Market Orders, get and set the order key
    if (txHash) {
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });
      const logs = parseEventLogs({
        abi: RouterABI,
        eventName: "PositionRequestCreated",
        logs: receipt.logs,
      });
      orderKey = logs[0].args.requestKey;
      eventConfig.args._orderKey = orderKey;
    }

    return await pollForEvent(publicClient, eventConfig);
  } catch (error: any) {
    console.error("Error in waitForExecution:", error);
    throw new Error(`Error waiting for execution: ${error.message}`);
  }
};

async function pollForEvent(
  publicClient: PublicClientType,
  eventConfig: EventConfig
) {
  const START_TIME = Date.now();
  const MAX_DURATION = 60 * 1000; // 1 minute in milliseconds
  const BACKDATE_BLOCKS = 10n;

  while (Date.now() - START_TIME < MAX_DURATION) {
    const latestBlock = await publicClient.getBlockNumber();
    const fromBlock = latestBlock - BACKDATE_BLOCKS;

    console.log(`Polling from block ${fromBlock} to ${latestBlock}`);

    const logs = await publicClient.getLogs({
      address: eventConfig.contractAddress,
      event: eventConfig.event,
      args: eventConfig.args,
      fromBlock: fromBlock,
      toBlock: "latest",
    });

    console.log(`Found ${logs.length} logs`);

    if (logs.length > 0) {
      console.log("Event detected:", logs[0]);
      return logs[0];
    }

    // Wait for a short interval before the next poll
    await new Promise((resolve) => setTimeout(resolve, 500)); // 1/2 seconds
  }

  console.log("Event not found after polling for 1 minute");
  throw new Error("Event not found after polling for 1 minute");
}
