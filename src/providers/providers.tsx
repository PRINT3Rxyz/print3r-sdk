import * as React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
  phantomWallet,
  rabbyWallet,
  coinbaseWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { NextUIProvider } from "@nextui-org/react";
import StoreProvider from "./StoreProvider";
import { getSupportedChains } from "../utils/web3/config";
import { Chain } from "viem/chains";

const { wallets } = getDefaultWallets();

export const wagmi_config = getDefaultConfig({
  appName: "PRINT3R SDK",
  projectId: "6f55cd09746c751c870f8205f87dcae0",
  wallets: [
    ...wallets,
    {
      groupName: "Other",
      wallets: [
        argentWallet,
        trustWallet,
        ledgerWallet,
        phantomWallet,
        rabbyWallet,
        coinbaseWallet,
        safeWallet,
        walletConnectWallet,
      ],
    },
  ],
  chains: getSupportedChains() as readonly [Chain, ...Chain[]],
  ssr: false,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmi_config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <StoreProvider>
            <NextUIProvider>{children}</NextUIProvider>
          </StoreProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
