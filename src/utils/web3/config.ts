import { http, createConfig } from "@wagmi/core";
import {
  // base,
  baseSepolia,
  Chain,
  // mode,
  modeTestnet,
} from "@wagmi/core/chains";

/**
 * ==================================== Types ====================================
 */

// export const BASE_CHAIN_ID = 8453;
export const BASE_SEPOLIA_CHAIN_ID = 84532;
export const MODE_SEPOLIA_CHAIN_ID = 919;
// export const MODE_CHAIN_ID = 34443;
export const ETH_BASE_UNIT = 1000000000000000000n;
export const USDC_BASE_UNIT = 1000000n;

interface BlockExplorers {
  [chainId: number]: string;
}

export const STABLECOINS = [
  "USDT",
  "USDC",
  "DAI",
  "BUSD",
  "UST",
  "USC",
  "YUSD",
  "UXD",
  "BAI",
  "USDE",
  "FDUSD",
  "PYUSD",
  "USDD",
  "FRAX",
  "TUSD",
  "ALUSD",
  "IONUSDT",
  "IONUSDC",
];

/**
 * ==================================== Config ====================================
 */

export const config = createConfig({
  chains: [baseSepolia, modeTestnet],
  transports: {
    // [base.id]: http(process.env.NEXT_BASE_MAINNET_RPC_URL),
    [baseSepolia.id]: http(process.env.NEXT_BASE_SEPOLIA_RPC_URL),
    [modeTestnet.id]: http(process.env.NEXT_MODE_SEPOLIA_RPC_URL),
  },
});

export const BLOCK_EXPLORERS: BlockExplorers = {
  84532: "https://sepolia.basescan.org",
  // 8453: "https://basescan.org",
  919: "https://sepolia.explorer.mode.network",
  // 34443: "https://explorer.mode.network/",
};

export const CHAIN_IMAGES: { [key: number]: string } = {
  // 8453: "/img/chains/base-logo.svg", // Base
  84532: "/img/chains/base-logo.svg", // Base sepolia
  919: "/img/chains/mode-logo.svg", // Mode sepolia
  // 34443: "/img/chains/mode-logo.svg", // Mode
};

export const CHAIN_NAMES: { [key: number]: string } = {
  // 8453: "base",
  84532: "baseSepolia",
  919: "modeTestnet",
  // 34443: "mode",
};

export const SUPPORTED_CHAIN_IDS = [
  BASE_SEPOLIA_CHAIN_ID,
  // BASE_CHAIN_ID,
  MODE_SEPOLIA_CHAIN_ID,
  // MODE_CHAIN_ID,
];

/**
 * ==================================== Helpers ====================================
 */

export const getBlockExplorer = (chainId: number) => {
  return BLOCK_EXPLORERS[chainId];
};

// @dev - Add any new chains here.
export const getChainFromChainId = (chainId: number) => {
  if (chainId === 84532) {
    return baseSepolia;
  } else if (chainId === 919) {
    return modeTestnet;
  } else {
    return baseSepolia;
  }
};

export const getSupportedChains = (): readonly [Chain, ...Chain[]] => {
  return [baseSepolia, modeTestnet];
};

export const getImageFromChainId = (chainId: number) => {
  return CHAIN_IMAGES[chainId];
};

export const getNameFromChainId = (chainId: number) => {
  return CHAIN_NAMES[chainId];
};
