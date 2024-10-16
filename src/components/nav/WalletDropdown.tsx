import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { FaRegCopy, FaPowerOff } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import { RxLightningBolt } from "react-icons/rx";

import CustomInput from "./CustomInput";
import NavModal from "./NavModal";
import { helperToast } from "../../utils/common/helperToast";
import useWallet from "../../hooks/useWallet";
import { useDisconnect } from "wagmi";
import { parseAbi } from "viem";
import { expandDecimals } from "../../utils/web3/conversions";
import { contractAddresses } from "../../utils/web3/contractAddresses";
import { getPublicClient } from "../../utils/web3/clients";
import CollateralInput from "../common/CollateralInput";
import {
  getEtherBalance,
  getUsdcBalance,
  getWrappedEtherBalance,
} from "../../utils/web3/utils";

type WalletDropdownProps = {
  account: {
    address: string;
    balanceDecimals?: number | undefined;
    balanceFormatted?: string | undefined;
    balanceSymbol?: string | undefined;
    displayBalance?: string | undefined;
    displayName: string;
    ensAvatar?: string | undefined;
    ensName?: string | undefined;
    hasPendingTransactions: boolean;
  };
};

const WalletDropdown: React.FC<WalletDropdownProps> = ({ account }) => {
  const [modalType, setModalType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<string>("0");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("ETH");
  const [convertAmount, setConvertAmount] = useState<number>(0);
  const [maxAutoTopUp, setMaxAutoTopUp] = useState<number>(0);
  const [userBalances, setUserBalances] = useState<{
    eth: number;
    weth: number;
    usdc: number;
  }>({ eth: 0, weth: 0, usdc: 0 });

  const {
    chainId,
    chainConfig,
    owner,
    client: walletClient,
    account: smartAccount,
    active,
  } = useWallet();

  const openModal = (type: string) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const { disconnect } = useDisconnect();

  const resetForm = () => {
    setTopUpAmount("0");
    setConvertAmount(0);
    setMaxAutoTopUp(0);
  };

  const handleMaxClick = () => {
    setTopUpAmount(
      selectedCurrency === "ETH"
        ? userBalances.eth.toString()
        : selectedCurrency === "WETH"
        ? userBalances.weth.toString()
        : userBalances.usdc.toString()
    );
  };

  const handleTopUp = async () => {
    if (!walletClient || !smartAccount || !owner || !chainId) return;

    try {
      if (!smartAccount) {
        throw new Error("Smart Account not found");
      }

      const publicClient = getPublicClient(chainId);
      let txHash;

      if (selectedCurrency === "ETH") {
        // Top up with ETH
        txHash = await walletClient.sendTransaction({
          account: owner,
          to: smartAccount as `0x${string}`,
          value: expandDecimals(Number(topUpAmount), 18),
        });
      } else {
        // Top up with USDC or WETH
        const tokenAddress = contractAddresses[chainId][
          selectedCurrency
        ] as `0x${string}`;
        const abi = parseAbi([
          "function transfer(address to, uint256 amount) external returns (bool)",
        ]);

        const decimals = selectedCurrency === "USDC" ? 6 : 18;
        const amount = expandDecimals(Number(topUpAmount), decimals);

        const { request } = await publicClient.simulateContract({
          account: owner,
          address: tokenAddress,
          abi,
          functionName: "transfer",
          args: [smartAccount as `0x${string}`, amount],
        });

        txHash = await walletClient.writeContract(request);
      }

      await publicClient.waitForTransactionReceipt({ hash: txHash });
      helperToast.success(`Top-up with ${selectedCurrency} successful`);
    } catch (error: any) {
      console.error("Error topping up:", error);
      helperToast.error(`Failed to top-up: ${error.message}`);
    }

    setIsModalOpen(false);
    resetForm();
  };

  // Used for getting WETH from ETH for auto top-ups
  const handleConvertEthToWeth = async () => {
    if (!owner || !walletClient || !chainId) return;

    const publicClient = getPublicClient(chainId);

    try {
      const abi = parseAbi(["function deposit() external payable"]);

      const weth = contractAddresses[chainId].WETH as `0x${string}`;

      const { request } = await publicClient.simulateContract({
        account: owner,
        address: weth,
        abi,
        functionName: "deposit",
        args: [],
        value: expandDecimals(convertAmount, 18),
      });

      const txHash = await walletClient.writeContract(request);

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      if (receipt.status !== "success") {
        throw new Error("Transaction failed");
      }

      helperToast.success("Conversion to WETH successful");
    } catch (error: any) {
      console.error("Error converting ETH to WETH:", error);
      helperToast.error(`Failed to convert ETH to WETH: ${error.message}`);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleApproveAutoTopUp = async () => {
    if (!walletClient || !smartAccount || !owner) return;

    const abi = parseAbi([
      "function approve(address spender, uint256 amount) external returns (bool)",
    ]);

    const autoTopUpAmount = expandDecimals(maxAutoTopUp, 18);

    const weth = contractAddresses[chainId].WETH as `0x${string}`;

    const publicClient = getPublicClient(chainId);

    // Owner approves smart account to spend their WETH
    try {
      const { request } = await publicClient.simulateContract({
        account: owner,
        address: weth,
        abi,
        functionName: "approve",
        args: [smartAccount as `0x${string}`, autoTopUpAmount],
      });

      const txHash = await walletClient.writeContract(request);

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      if (receipt.status !== "success") {
        throw new Error("Transaction failed");
      }

      helperToast.success("Auto top-up approved");
    } catch (error: any) {
      console.error("Error approving auto top-up:", error);
      helperToast.error("Failed to approve auto top-up");
    }

    setIsModalOpen(false);
    resetForm();
  };

  useEffect(() => {
    resetForm();
  }, [isModalOpen]);

  useEffect(() => {
    const handleFetchUserBalance = async () => {
      if (!owner || !active) return;
      const [etherBalance, usdcBalance, wethBalance] = await Promise.all([
        getEtherBalance(chainId, owner),
        getUsdcBalance(chainId, owner),
        getWrappedEtherBalance(chainId, owner),
      ]);
      setUserBalances({
        eth: parseFloat(etherBalance),
        weth: parseFloat(wethBalance),
        usdc: parseFloat(usdcBalance),
      });
    };

    handleFetchUserBalance();
  }, [owner, chainId, active, isModalOpen]);

  return (
    <div>
      <Dropdown className="bg-transparent">
        <DropdownTrigger>
          <button className="flex items-center bg-p3-button-hover hover:bg-p3-button-hover border-2 border-p3 !rounded-3 text-white py-2 px-4 h-10 focus:outline-none">
            <img
              src="/img/nav/wallet-icon.png"
              className="w-5 h-auto"
              alt="Wallet Icon"
              width={128}
              height={128}
            />
            <span className="hidden sm:inline-block ml-2">
              {account.displayName.substring(0, 4)}...
              {account.displayName.substring(account.displayName.length - 4)}
            </span>
          </button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Action event example"
          className={"bg-card-grad border-cardborder border-2 rounded p-2"}
        >
          <DropdownItem
            key="Copy Address"
            onClick={() => {
              navigator.clipboard.writeText(account.address);
              helperToast.success(`${account.address} Copied to Clipboard`);
            }}
          >
            <div className="flex flex-row gap-2 items-center">
              <FaRegCopy />
              <p>Copy Address</p>
            </div>
          </DropdownItem>
          <DropdownItem key="View in explorer">
            <div
              className="flex flex-row gap-2 items-center"
              onClick={() => {
                chainConfig &&
                  chainConfig.blockExplorers &&
                  window.open(
                    `${chainConfig.blockExplorers.default.url}/address/${account.address}`,
                    "_blank",
                    "noopener noreferrer"
                  );
              }}
            >
              <TbWorld />
              <p>View in explorer</p>
            </div>
          </DropdownItem>
          <DropdownItem key="One Click Trading">
            <div
              className="flex flex-row gap-2 items-center"
              onClick={() => openModal("oneClickTrading")}
            >
              <RxLightningBolt />
              <p>One Click Trading</p>
            </div>
          </DropdownItem>
          <DropdownItem
            key="Disconnect"
            onClick={() => {
              disconnect && disconnect();
              helperToast.info("Wallet Disconnected");
            }}
          >
            <div className="flex flex-row gap-2 items-center">
              <FaPowerOff />
              <p>Disconnect</p>
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {modalType === "oneClickTrading" && (
        <NavModal
          isOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          title={"One-Click Trading"}
          image={"/img/nav/one-click-trading.png"}
          imageWidth={100}
          imageHeight={150}
          imageAlt="lightning bolt image"
        >
          <div className="flex flex-row justify-between py-4 border-t-1 border-t-printer-orange">
            <p>Main Account Balance (ETH):</p>
            <span>{userBalances.eth.toFixed(6)}</span>
          </div>
          <div className="flex flex-row justify-between py-4">
            <p>Main Account Balance (WETH):</p>
            <span>{userBalances.weth.toFixed(6)}</span>
          </div>
          <div className="flex flex-row justify-between py-4 border-b-1 border-b-printer-orange">
            <p>Main Account Balance (USDC):</p>
            <span>{userBalances.usdc.toFixed(2)}</span>
          </div>
          <div className="flex flex-col gap-3 py-4">
            <div className="flex flex-row justify-between items-center">
              <CollateralInput
                value={topUpAmount}
                onValueChange={(value) => setTopUpAmount(value)}
                collateralType={selectedCurrency}
                onCollateralTypeChange={setSelectedCurrency}
                collateralOptions={["ETH", "WETH", "USDC"]}
                onMaxClick={handleMaxClick}
                placeholder=""
                balance={
                  selectedCurrency === "ETH"
                    ? userBalances.eth.toString()
                    : selectedCurrency === "WETH"
                    ? userBalances.weth.toString()
                    : userBalances.usdc.toString()
                }
                title="Top-Up"
                showSelectCurrency={true}
              />
            </div>
            <Button
              className="w-full flex items-center justify-center text-center text-base bg-p3-button hover:bg-p3-button-hover border-2 border-p3 !rounded-3 text-white py-4 font-bold"
              onClick={handleTopUp}
            >
              Top Up
            </Button>
            <div className="flex flex-row justify-between items-center mt-4">
              <p className="text-base-gray">Convert ETH to WETH</p>
              <CustomInput
                unit="ETH"
                value={convertAmount}
                onChange={(value) => setConvertAmount(Number(value))}
              />
            </div>
            <Button
              className="w-full flex items-center justify-center text-center text-base bg-p3-button hover:bg-p3-button-hover border-2 border-p3 !rounded-3 text-white py-4 font-bold"
              onClick={handleConvertEthToWeth}
            >
              Convert ETH to WETH
            </Button>
            <div className="flex flex-row justify-between items-center mt-4">
              <p className="text-base-gray">Auto Top-up</p>
              <CustomInput
                unit="ETH"
                value={maxAutoTopUp}
                onChange={(value) => setMaxAutoTopUp(Number(value))}
              />
            </div>
            <Button
              className="w-full flex items-center justify-center text-center text-base bg-p3-button hover:bg-p3-button-hover border-2 border-p3 !rounded-3 text-white py-4 font-bold"
              onClick={handleApproveAutoTopUp}
            >
              Approve Auto Top-up
            </Button>
          </div>
        </NavModal>
      )}
    </div>
  );
};

export default WalletDropdown;
