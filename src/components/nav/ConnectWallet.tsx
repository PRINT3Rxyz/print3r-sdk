import { ConnectButton } from "@rainbow-me/rainbowkit";
import WalletDropdown from "./WalletDropdown";

const ConnectWallet = ({ styles }: { styles: string }) => {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, openChainModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div>
            {connected ? (
              <WalletDropdown account={account} />
            ) : (
              <button className={styles} onClick={openConnectModal}>
                <img
                  src="/img/nav/wallet-icon.png"
                  className="w-5 h-auto sm:mr-2"
                  alt="Wallet Icon"
                  width={128}
                  height={128}
                />

                <span className="hidden sm:inline-block">Connect</span>
              </button>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectWallet;
