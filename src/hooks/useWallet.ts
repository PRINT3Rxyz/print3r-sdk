import { SUPPORTED_CHAIN_IDS } from "../utils/web3/config";
import { wagmi_config } from "../providers/providers";
import { useAccount, useBalance, useWalletClient } from "wagmi";
import { useState, useEffect } from "react";
import {
  BiconomySmartAccountV2,
  createSmartAccountClient,
} from "@biconomy/account";
import { WalletClient } from "viem";

const useWallet = () => {
  const { address, isConnected, connector, chain } = useAccount();
  const ethBalance = useBalance({
    address: address,
  });

  const { data: client } = useWalletClient();

  const chainId = chain?.id || SUPPORTED_CHAIN_IDS[0];

  const isLoading = chain ? false : true;

  const [smartAccount, setSmartAccount] =
    useState<BiconomySmartAccountV2 | null>(null);
  const [smartAccountAddress, setSmartAccountAddress] = useState<
    `0x${string}` | undefined
  >(undefined);

  useEffect(() => {
    const createSmartAccount = async () => {
      if (address && chainId && client) {
        const bundlerUrlTemplate = import.meta.env.VITE_BICONOMY_BUNDLER_URL;

        if (!bundlerUrlTemplate) {
          throw new Error("Biconomy bundler URL is not set");
        }

        // Replace the placeholder with the actual chainId
        const bundlerUrl = bundlerUrlTemplate.replace(
          "{chain-id-here}",
          chainId.toString()
        );

        try {
          const smartWallet = await createSmartAccountClient({
            chainId,
            signer: client as WalletClient,
            bundlerUrl,
          });

          const saAddress = await smartWallet.getAccountAddress();

          setSmartAccount(smartWallet);
          setSmartAccountAddress(saAddress);
        } catch (error) {
          console.error("Error creating smart account:", error);
        }
      }
    };

    createSmartAccount();
  }, [chainId, client, address]);

  return {
    account: smartAccountAddress,
    active: isConnected,
    connector,
    chainId: chainId,
    chainConfig: wagmi_config.chains.find((item: any) => item.id === chainId),
    client: client ?? undefined,
    ethBalance,
    isLoading,
    smartAccount,
    owner: address,
  };
};

export default useWallet;
