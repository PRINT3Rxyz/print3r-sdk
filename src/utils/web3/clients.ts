import { createPublicClient, createWalletClient, http, webSocket } from "viem";
import { getChainFromChainId } from "./config";

type RpcUrl = {
  [chainId: number]: string;
};

export const RPC_URLS: RpcUrl = {
  8453: import.meta.env.VITE_BASE_RPC_URL!,
  84532: import.meta.env.VITE_BASE_SEPOLIA_RPC_URL!,
  919: import.meta.env.VITE_MODE_SEPOLIA_RPC_URL!,
  34443: import.meta.env.VITE_MODE_RPC_URL!,
};

// @ts-ignore
export type PublicClientType = ReturnType<typeof getPublicClient>;

export type WalletClientType = ReturnType<typeof createWalletClient>;

export const getPublicClient = (chainId: number) => {
  return createPublicClient({
    chain: getChainFromChainId(chainId),
    transport: http(RPC_URLS[chainId]),
  });
};
