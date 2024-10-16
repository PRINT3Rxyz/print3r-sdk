import { useState, useEffect } from "react";

import ValueInput from "../common/ValueInput";
import { Button } from "@nextui-org/react";
import { getImageUrlfromTokenSymbol } from "../../utils/common/getTokenImage";
import ModalV2 from "../../components/common/ModalV2";
import InputField from "../../components/common/InputField";
import ActionButtons from "./ActionButtons";
import LeverageSlider from "../../components/interaction/leverage/LeverageSlider";
import CustomSelect from "../common/CustomSelect";
import { PiKeyReturnBold } from "react-icons/pi";
import useWallet from "../../hooks/useWallet";
import {
  getEtherBalance,
  getUsdcBalance,
  getWrappedEtherBalance,
} from "../../utils/web3/utils";
import { formatFloatWithCommas } from "../../utils/common/formatters";
import { getRewardTrackerBalance } from "../../utils/web3/getRewardTrackerBalance";
import { getTotalLocked } from "../../utils/web3/getTotalLocked";
import {
  contractDecimals,
  convertFromWei,
  convertToSeconds,
  expandDecimals,
  TimeOption,
  timeOptions,
} from "../../utils/web3/conversions";
import { contractAddresses } from "../../utils/web3/contractAddresses";
import { getPublicClient, WalletClientType } from "../../utils/web3/clients";
import { getMarketTokenPrices } from "../../utils/web3/getMarketTokenPrices";
import { getLpTokenPrice } from "../../utils/web3/getLpTokenPrice";
import { helperToast } from "../../utils/common/helperToast";
import { waitForExecution } from "../../utils/web3/waitForExecution";
import { VaultABI } from "../../utils/web3/abis/Vault";
import { MarketABI } from "../../utils/web3/abis/Market";
import { erc20Abi, parseAbiItem, zeroAddress } from "viem";
import TransactionPending from "../../components/common/TransactionPending";
import { getDetailsForMarket } from "../../utils/web3/getDetailsForMarket";
import MyLockedAssets from "../../components/liquidity/MyLockedAssets";
import { Lock } from "../../types/lock";
import { getAllActiveLocks } from "../../utils/web3/getAllActiveLocks";
import { unlockLiquidity } from "../../utils/web3/unlockLiquidity";
import { getTotalAvailableLiquidity } from "../../utils/web3/getTotalAvailableLiquidity";
import { FaRegQuestionCircle } from "react-icons/fa";
import LiquidityTooltip from "./LiquidityTooltip";
import {
  calculateDepositFee,
  calculateWithdrawalFee,
} from "../../utils/liquidity/calculateLiquidityFees";
import { getExecutionFees } from "../../utils/web3/getExecutionFees";
import CollateralInput from "../../components/common/CollateralInput";
import CustomTooltip from "../../components/common/CustomTooltip";
import {
  getChainFromChainId,
  getImageFromChainId,
} from "../../utils/web3/config";
import { executeTransactions } from "../../utils/web3/executeTransactions";
import { RouterABI } from "../../utils/web3/abis/Router";

type LiquidityModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleBackClick: () => void;
  collateralType: string;
  marketId: `0x${string}`;
  refreshTableData: () => Promise<void>;
};

const tabs = [
  { label: "Deposit", value: "deposit" },
  { label: "Withdraw", value: "withdraw" },
];

const transactionSteps = [
  {
    text: "Approve Tokens",
    subtext: "Approve the contract to spend tokens.",
    failedText: "Failed to approve tokens.",
    failedSubtext: "Please try again.",
    successText: "Tokens Approved!",
    successSubtext: "You can now deposit tokens.",
  },
  {
    text: "Initiate Transaction",
    subtext: "Initiate the transaction onchain.",
    failedText: "Failed to initiate transaction.",
    failedSubtext: "Please try again.",
    successText: "Transaction Initiated!",
    successSubtext: "Waiting for a keeper to execute the transaction.",
  },
  {
    text: "Executing Transaction",
    subtext: "Waiting for a keeper. This may take a minute.",
    failedText: "Failed to execute transaction.",
    failedSubtext: "Please try again.",
    successText: "Transaction Executed!",
    successSubtext: "You can now close this modal.",
  },
];

const LiquidityModal = ({
  isModalOpen,
  setIsModalOpen,
  handleBackClick,
  collateralType,
  marketId,
  refreshTableData,
}: LiquidityModalProps) => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].value);

  const [lockDuration, setLockDuration] = useState<string>("0");

  const [timePeriod, setTimePeriod] = useState<TimeOption>("DAYS");

  const [withdrawMode, setWithdrawMode] = useState<"regular" | "unlock">(
    "regular"
  );

  const [userBalances, setUserBalances] = useState({
    eth: 0,
    weth: 0,
    usdc: 0,
  });

  const [tokenBalance, setTokenBalance] = useState<{
    longTokenBalance: number | null;
    shortTokenBalance: number | null;
  }>({
    longTokenBalance: null,
    shortTokenBalance: null,
  });

  const [collateral, setCollateral] = useState<string>("");

  const [userDepositTokens, setUserDepositTokens] = useState<number>(0);

  const [estimatedFee, setEstimatedFee] = useState<number>(0);

  const [feeUsd, setFeeUsd] = useState<number>(0);

  const [activeLocks, setActiveLocks] = useState<Lock[]>([]);

  const [maxWithdrawableAmount, setMaxWithdrawableAmount] = useState<number>(0);

  const [selectedCurrency, setSelectedCurrency] =
    useState<string>(collateralType);

  const [marketDetails, setMarketDetails] = useState<{
    ticker: string;
    poolSymbol: string;
    rewardTracker: `0x${string}`;
  }>({ ticker: "", poolSymbol: "", rewardTracker: zeroAddress });

  const [totalAvailableLpTokens, setTotalAvailableLpTokens] =
    useState<number>(0);

  const [executionFees, setExecutionFees] = useState<{
    executionFee: number;
    priceUpdateFee: number;
  }>({
    executionFee: 0,
    priceUpdateFee: 0,
  });

  const [equivalentValues, setEquivalentValues] = useState<{
    equivalentValue: number;
    equivalentTokens: number;
  }>({ equivalentValue: 0, equivalentTokens: 0 });

  const [selectedLock, selectLock] = useState<Lock | null>(null);

  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

  const [transactionState, setTransactionState] = useState({
    isOpen: false,
    currentStep: 0,
    hasFailedAtCurrentStep: false,
    isComplete: false,
  });

  const [availableLiquidity, setAvailableLiquidity] = useState<{
    eth: number;
    usdc: number;
  }>({ eth: 0, usdc: 0 });

  const [prices, setPrices] = useState<{
    ethPrice: number;
    usdcPrice: number;
    lpTokenPrice: number;
  }>({
    ethPrice: 0,
    usdcPrice: 0,
    lpTokenPrice: 0,
  });

  const [transactionPending, setTransactionPending] = useState<boolean>(false);

  const {
    chainId,
    account,
    client: walletClient,
    active,
    smartAccount,
  } = useWallet();

  const resetForm = () => {
    setCollateral("");
    setLockDuration("0");
    setTimePeriod("DAYS");
    setWithdrawMode("regular");
    selectLock(null);
  };

  const updateTransactionState = (
    updates: Partial<typeof transactionState>
  ) => {
    setTransactionState((prevState) => ({ ...prevState, ...updates }));
  };

  const handleInputChange = (value: string) => {
    setCollateral(value);
    if (withdrawMode === "unlock") {
      setWithdrawMode("regular");
      selectLock(null);
    }
  };

  const handleSelectLock = (lock: Lock) => {
    selectLock(lock);
    setWithdrawMode("unlock");
    setCollateral(contractDecimals(lock.depositAmount, 18).toString());
    setButtonDisabled(false);
  };

  const closeTransactionModal = () => {
    updateTransactionState({
      isOpen: false,
      currentStep: 0,
      hasFailedAtCurrentStep: false,
      isComplete: false,
    });
  };

  const getButtonText = () => {
    if (activeTab === tabs[0].value) {
      // Deposit tab
      return parseInt(lockDuration) > 0 ? "Deposit and Lock" : "Deposit";
    } else {
      // Withdraw tab
      return withdrawMode === "unlock" ? "Unlock and Withdraw" : "Withdraw";
    }
  };

  const fetchVaultBalances = async () => {
    if (!chainId || !marketId || marketId.length !== 66) return;

    const publicClient = getPublicClient(chainId);

    const vault = await publicClient.readContract({
      address: contractAddresses[chainId].MARKET as `0x${string}`,
      abi: MarketABI,
      functionName: "getVault",
      args: [marketId],
    });

    const [longTokenBalance, shortTokenBalance] = await publicClient.multicall({
      contracts: [
        {
          address: vault,
          abi: VaultABI,
          functionName: "longTokenBalance",
        },
        {
          address: vault,
          abi: VaultABI,
          functionName: "shortTokenBalance",
        },
      ],
    });

    if (
      longTokenBalance.status !== "success" ||
      shortTokenBalance.status !== "success"
    ) {
      throw new Error("Failed to fetch token balances");
    }

    setTokenBalance({
      longTokenBalance: contractDecimals(longTokenBalance.result, 18),
      shortTokenBalance: contractDecimals(shortTokenBalance.result, 6),
    });
  };

  const fetchActiveLocks = async () => {
    if (!marketId || !account) return;
    const locks: readonly Lock[] = await getAllActiveLocks(
      chainId,
      account as `0x${string}`,
      marketId
    );
    setActiveLocks(locks as Lock[]);
  };

  useEffect(() => {
    if (!isModalOpen) {
      resetForm();
    }
  }, [isModalOpen]);

  useEffect(() => {
    fetchVaultBalances();
  }, [chainId, marketId]);

  useEffect(() => {
    const handleFetchUserBalance = async () => {
      if (!active || !account) return;
      const [etherBalance, usdcBalance, wethBalance] = await Promise.all([
        getEtherBalance(chainId, account),
        getUsdcBalance(chainId, account),
        getWrappedEtherBalance(chainId, account),
      ]);
      setUserBalances({
        eth: parseFloat(etherBalance),
        weth: parseFloat(wethBalance),
        usdc: parseFloat(usdcBalance),
      });
    };

    handleFetchUserBalance();
  }, [account, chainId, active, isModalOpen, collateralType]);

  useEffect(() => {
    const fetchMarketDetails = async () => {
      const details = await getDetailsForMarket(chainId, marketId);
      setMarketDetails(details);
    };

    fetchMarketDetails();
  }, [chainId, marketId]);

  useEffect(() => {
    const calculateMaxWithdrawable = async () => {
      if (activeTab === tabs[1].value && collateral && availableLiquidity) {
        let availableLiquidityForToken: number | undefined;
        let equivalentTokensToWithdraw: number | undefined;

        if (collateralType === "ETH" || collateralType === "WETH") {
          availableLiquidityForToken = availableLiquidity.eth;
          equivalentTokensToWithdraw = equivalentValues.equivalentTokens;
        } else if (collateralType === "USDC") {
          availableLiquidityForToken = availableLiquidity.usdc;
          equivalentTokensToWithdraw = equivalentValues.equivalentTokens;
        }

        if (
          availableLiquidityForToken !== undefined &&
          equivalentTokensToWithdraw !== undefined
        ) {
          const hasSufficientLiquidity =
            equivalentTokensToWithdraw <= availableLiquidityForToken;
          setButtonDisabled(!hasSufficientLiquidity);

          // Calculate maximum withdrawable amount
          const maxWithdraw = Math.min(
            availableLiquidityForToken,
            userDepositTokens
          );
          setMaxWithdrawableAmount(maxWithdraw);
        }
      }
    };

    calculateMaxWithdrawable();
  }, [
    activeTab,
    collateral,
    collateralType,
    availableLiquidity,
    equivalentValues,
    userDepositTokens,
    prices,
  ]);

  useEffect(() => {
    const fetchExecutionFees = async () => {
      if (!chainId) return;

      const executionFees = await getExecutionFees(
        chainId,
        activeTab === tabs[0].value ? "deposit" : "withdrawal",
        0
      );

      setExecutionFees({
        executionFee: convertFromWei(executionFees[0]),
        priceUpdateFee: convertFromWei(executionFees[1]),
      });
    };

    fetchExecutionFees();
  }, [chainId, activeTab]);

  useEffect(() => {
    const fetchPrices = async () => {
      const { ethPrice, usdcPrice } = await getMarketTokenPrices();

      const lpPrice = await getLpTokenPrice(
        chainId,
        marketId,
        ethPrice,
        usdcPrice
      );

      const lpPriceFloat = lpPrice === 0n ? 1.0 : contractDecimals(lpPrice, 30);
      setPrices({ ethPrice, usdcPrice, lpTokenPrice: lpPriceFloat });
    };

    fetchPrices();
  }, [chainId, marketId]);

  useEffect(() => {
    const fetchEquivalentValues = async () => {
      if (!marketId || !prices.lpTokenPrice) return;

      let collateralUsd;
      let lpPriceFloat;

      collateralUsd =
        collateralType === "USDC"
          ? parseFloat(collateral) * prices.usdcPrice
          : parseFloat(collateral) * prices.ethPrice;

      lpPriceFloat = prices.lpTokenPrice;

      if (activeTab === tabs[0].value) {
        // Deposit Case -> convert collateral tokens into lp tokens
        const equivalentTokens = collateralUsd / lpPriceFloat;
        const equivalentValue = equivalentTokens * lpPriceFloat;
        setEquivalentValues({
          equivalentValue: equivalentValue,
          equivalentTokens: equivalentTokens,
        });
      } else if (activeTab === tabs[1].value) {
        // Withdrawal case -> convert lp tokens into collateral tokens
        const equivalentValue = parseFloat(collateral) * lpPriceFloat;
        const equivalentTokens =
          equivalentValue /
          (collateralType === "USDC" ? prices.usdcPrice : prices.ethPrice);
        setEquivalentValues({
          equivalentValue: equivalentValue,
          equivalentTokens: equivalentTokens,
        });
      }
    };

    fetchEquivalentValues();
  }, [collateral, collateralType, activeTab, chainId, marketId, tabs, prices]);

  useEffect(() => {
    const fetchDepositToken = async () => {
      if (!marketId || marketId.length !== 66) return;
      if (!active || !account) return;
      const totalBal = await getRewardTrackerBalance(
        chainId,
        account as `0x${string}`,
        marketId
      );
      const totalLocked = await getTotalLocked(
        chainId,
        account as `0x${string}`,
        marketId
      );
      setTotalAvailableLpTokens(contractDecimals(totalBal, 18));
      setUserDepositTokens(contractDecimals(totalBal - totalLocked, 18));
    };

    fetchDepositToken();
  }, [marketId, account, active, chainId]);

  useEffect(() => {}, []);

  useEffect(() => {
    const fetchEstimatedFee = () => {
      if (!chainId || !marketId) return;
      if (activeTab === tabs[0].value) {
        const fee = calculateDepositFee(
          prices.ethPrice,
          prices.usdcPrice,
          tokenBalance.longTokenBalance || 0,
          tokenBalance.shortTokenBalance || 0,
          parseFloat(collateral),
          collateralType === "ETH" || collateralType === "WETH"
        );
        const feeUsd =
          collateralType === "ETH" || collateralType === "WETH"
            ? fee * prices.ethPrice
            : fee * prices.usdcPrice;

        setEstimatedFee(fee);
        setFeeUsd(feeUsd);
      } else {
        const fee = calculateWithdrawalFee(
          prices.ethPrice,
          prices.usdcPrice,
          tokenBalance.longTokenBalance || 0,
          tokenBalance.shortTokenBalance || 0,
          equivalentValues.equivalentTokens,
          collateralType === "ETH" || collateralType === "WETH"
        );
        const feeUsd =
          collateralType === "ETH" || collateralType === "WETH"
            ? fee * prices.ethPrice
            : fee * prices.usdcPrice;

        setEstimatedFee(fee);
        setFeeUsd(feeUsd);
      }
    };

    fetchEstimatedFee();
  }, [
    chainId,
    marketId,
    collateral,
    collateralType,
    activeTab,
    equivalentValues,
    tokenBalance,
    prices,
  ]);

  const handleTimeChange = (selectedTimePeriod: TimeOption) => {
    setTimePeriod(selectedTimePeriod);
  };

  const handleToggle = (tab: string) => {
    setActiveTab(tab);
  };

  const handleMaxClick = () => {
    if (activeTab === tabs[1].value) {
      // Withdraw Mode
      setCollateral(maxWithdrawableAmount.toString());
    } else {
      setCollateral(
        collateralType === "ETH"
          ? selectedCurrency === "ETH"
            ? userBalances.eth.toString()
            : userBalances.weth.toString()
          : collateralType === "USDC"
          ? userBalances.usdc.toString()
          : userBalances.weth.toString()
      );
    }
  };

  const handleFunctionCall = async () => {
    setTransactionPending(true);

    const collateralAmount =
      collateralType === "USDC"
        ? expandDecimals(parseFloat(collateral), 6)
        : expandDecimals(parseFloat(collateral), 18);

    try {
      if (activeTab === tabs[0].value) {
        await handleDeposit(collateralAmount);
      } else {
        if (withdrawMode === "unlock" && selectedLock) {
          if (!smartAccount) return;
          helperToast.info("Unlocking Liquidity 🔓");
          // First, unlock the liquidity
          await unlockLiquidity(
            chainId,
            account as `0x${string}`,
            marketId,
            [selectedLock.lockKey],
            smartAccount
          );
        }
        await handleWithdraw(collateralAmount);
      }
      setTransactionPending(false);
    } catch (error) {
      setTransactionPending(false);
      helperToast.error(`Transaction Failed: ${error}`);
      console.error("Transaction error:", error);
    }

    resetForm();
    setIsModalOpen(false);
  };

  const handleDeposit = async (collateralAmount: bigint) => {
    if (!account || !smartAccount) return;

    updateTransactionState({
      isOpen: true,
      currentStep: 0,
      hasFailedAtCurrentStep: false,
      isComplete: false,
    });

    const collateralToken =
      collateralType === "USDC" ? collateralType : selectedCurrency;

    const router = contractAddresses[chainId].ROUTER as `0x${string}`;

    const chain = getChainFromChainId(chainId);

    let transactions = [];

    if (collateralToken !== "ETH") {
      const approvalTx = {
        account: account,
        address: contractAddresses[chainId][collateralToken] as `0x${string}`,
        abi: erc20Abi,
        functionName: "approve",
        args: [router, collateralAmount],
        chain: chain,
      };

      transactions.push(approvalTx);
    }

    let stakeDuration: number = convertToSeconds(
      parseInt(lockDuration),
      timePeriod
    );

    const executionFees = await getExecutionFees(chainId, "deposit", 0);

    const totalExecutionFee = executionFees[0] + executionFees[1];

    const depositTx = {
      account: account,
      abi: RouterABI,
      address: contractAddresses[chainId].ROUTER as `0x${string}`,
      functionName: "createDeposit",
      args: [
        marketId,
        account,
        collateralToken,
        collateralAmount,
        totalExecutionFee,
        stakeDuration,
        selectedCurrency === "ETH",
      ],
      value:
        collateralToken === "ETH"
          ? collateralAmount + totalExecutionFee
          : totalExecutionFee,
      chain: chain,
    };

    transactions.push(depositTx);

    try {
      const receipts = await executeTransactions({
        transactions,
        smartAccount,
      });
    } catch (error) {
      console.error("Transaction error:", error);
      helperToast.error(`Transaction Failed: ${error}`);
    }

    const publicClient = getPublicClient(chainId);

    const vault = await publicClient.readContract({
      address: contractAddresses[chainId].MARKET as `0x${string}`,
      abi: MarketABI,
      functionName: "getVault",
      args: [marketId],
    });

    // Step 2: Wait for Execution
    await waitForExecution(chainId, {
      contractAddress: vault,
      abi: VaultABI,
      eventName: "DepositExecuted",
      args: { account },
      event: parseAbiItem(
        "event DepositExecuted(bytes32 indexed key, address indexed account, uint256 amountIn, uint256 mintAmount, bool isLongToken)"
      ),
    });

    updateTransactionState({ currentStep: 3, isComplete: true });

    helperToast.success("Deposit Successful! ✅");

    refreshTableData();

    // Close the modal after a short delay
    setTimeout(() => {
      updateTransactionState({ isOpen: false });
      resetForm();
    }, 3000);
  };

  const handleWithdraw = async (collateralAmount: bigint) => {
    if (!account || !smartAccount) return;

    updateTransactionState({
      isOpen: true,
      currentStep: 0,
      hasFailedAtCurrentStep: false,
    });

    const collateralToken =
      collateralType === "USDC" ? collateralType : selectedCurrency;

    const router = contractAddresses[chainId].ROUTER as `0x${string}`;

    const chain = getChainFromChainId(chainId);

    let transactions = [];

    if (collateralToken !== "ETH") {
      const approvalTx = {
        account: account,
        address: contractAddresses[chainId][collateralToken] as `0x${string}`,
        abi: erc20Abi,
        functionName: "approve",
        args: [router, collateralAmount],
        chain: chain,
      };

      transactions.push(approvalTx);
    }

    const market = contractAddresses[chainId].MARKET as `0x${string}`;

    const tokenOut = contractAddresses[chainId][
      collateralType
    ] as `0x${string}`;

    const executionFees = await getExecutionFees(chainId, "withdrawal", 0);

    const totalExecutionFee = executionFees[0] + executionFees[1];

    const withdrawTx = {
      account: account,
      abi: RouterABI,
      address: contractAddresses[chainId].ROUTER as `0x${string}`,
      functionName: "createWithdrawal",
      args: [
        marketId,
        account,
        tokenOut,
        collateralAmount,
        totalExecutionFee,
        selectedCurrency === "ETH",
      ],
      value: totalExecutionFee,
    };

    transactions.push(withdrawTx);

    try {
      const receipts = await executeTransactions({
        transactions,
        smartAccount,
      });

      if (receipts.some((receipt) => !receipt.success)) {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Transaction error:", error);
      updateTransactionState({ hasFailedAtCurrentStep: true });
      helperToast.error(`Transaction Failed: ${error}`);
    }

    const publicClient = getPublicClient(chainId);

    const vault = await publicClient.readContract({
      address: market,
      abi: MarketABI,
      functionName: "getVault",
      args: [marketId],
    });

    await waitForExecution(chainId, {
      contractAddress: vault,
      abi: VaultABI,
      eventName: "WithdrawalExecuted",
      args: { account },
      event: parseAbiItem(
        "event WithdrawalExecuted(bytes32 indexed key, address indexed account, uint256 amountIn, uint256 amountOut, bool isLongToken)"
      ),
    });

    updateTransactionState({ currentStep: 3, isComplete: true });

    helperToast.success("Withdrawal Successful! ✅");

    refreshTableData();

    // Close the modal after a short delay
    setTimeout(() => {
      updateTransactionState({ isOpen: false });
      resetForm();
    }, 3000);
  };

  useEffect(() => {
    const fetchTotalAvailableLiquidity = async () => {
      if (!chainId || !marketId || marketId.length !== 66) return;
      const { eth, usdc } = await getTotalAvailableLiquidity(chainId, marketId);
      setAvailableLiquidity({
        eth: contractDecimals(eth, 18),
        usdc: contractDecimals(usdc, 6),
      });
    };

    fetchTotalAvailableLiquidity();
  }, [chainId, marketId]);

  return (
    <ModalV2 isOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
      <div className="flex flex-col gap-4 w-full h-full p-6">
        <div className="flex-grow pb-12 md:pb-0">
          <div className="flex flex-row justify-between w-full items-center">
            <p className="text-xl font-white font-medium">Manage Liquidity</p>
            <PiKeyReturnBold
              onClick={handleBackClick}
              className="text-3xl text-printer-orange font-bold cursor-pointer hover:text-printer-light-orange"
            />
          </div>
          <div className="flex gap-2 w-full">
            <ValueInput
              title="Asset to Supply"
              className="mb-4"
              wrapperClassName="w-full"
              readonly
              symbol={
                <div className="flex flex-row gap-2 items-center">
                  <img
                    src={getImageUrlfromTokenSymbol(
                      collateralType === "ETH"
                        ? selectedCurrency
                        : collateralType
                    )}
                    width={24}
                    height={24}
                    alt={`${
                      collateralType === "ETH"
                        ? selectedCurrency
                        : collateralType
                    } Logo`}
                    className="rounded-full"
                  />
                  <p>
                    {collateralType === "ETH"
                      ? selectedCurrency
                      : collateralType}
                  </p>
                </div>
              }
            />

            <ValueInput
              readonly
              title="Chain"
              value=""
              className="mb-4"
              wrapperClassName="w-16"
              symbol={
                <img
                  src={getImageFromChainId(chainId)}
                  alt="exchange"
                  width={128}
                  height={128}
                  className="h-6 w-6  rounded-full"
                />
              }
            />
          </div>
          <div className="w-full h-px bg-divider" />
          <div className="py-6">
            <ActionButtons
              activeTab={activeTab}
              handleToggle={handleToggle}
              tabs={tabs}
            />
          </div>
          {activeTab === tabs[0].value ? (
            <>
              <CollateralInput
                value={collateral}
                onValueChange={(value) => setCollateral(value)}
                collateralType={
                  collateralType === "ETH" ? selectedCurrency : collateralType
                }
                onCollateralTypeChange={
                  collateralType === "ETH" ? setSelectedCurrency : undefined
                }
                collateralOptions={
                  collateralType === "ETH" ? ["ETH", "WETH"] : []
                }
                onMaxClick={handleMaxClick}
                placeholder=""
                balance={
                  collateralType === "ETH"
                    ? selectedCurrency === "ETH"
                      ? userBalances.eth.toString()
                      : userBalances.weth.toString()
                    : collateralType === "USDC"
                    ? userBalances.usdc.toString()
                    : userBalances.weth.toString()
                }
                title="Supply"
                showSelectCurrency={collateralType === "ETH"}
              />

              <InputField
                readOnly={true}
                hideMax={true}
                value={
                  isNaN(equivalentValues.equivalentTokens)
                    ? "0.00"
                    : equivalentValues.equivalentTokens.toString()
                }
                onChange={(e) => {}}
                className="mt-2"
                renderContent={
                  <div className="flex flex-row gap-2 items-center font-medium text-lg">
                    <img
                      src={getImageUrlfromTokenSymbol(
                        marketDetails.ticker.split(":")[0]
                      )}
                      width={24}
                      height={24}
                      alt={`${marketDetails.ticker.split(":")[0]} Logo`}
                      className="rounded-full"
                    />
                    <p>{marketDetails.poolSymbol}</p>
                  </div>
                }
                renderTitle={<p className=" text-xs ">Receive</p>}
              />
              <p className="text-base-gray mt-2">Lock Duration:</p>
              <div
                className={`flex justify-between items-center py-3 px-3 bg-input-grad border-cardborder border-2 rounded-lg`}
              >
                <div>
                  <input
                    type="number"
                    value={lockDuration}
                    max={1000}
                    min={1}
                    step={1}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value)) {
                        const clampedValue = Math.min(
                          Math.max(Math.round(value), 1),
                          1000
                        );
                        setLockDuration(clampedValue.toString());
                      } else {
                        setLockDuration("");
                      }
                    }}
                    className="text-white text-lg bg-transparent outline-none w-full"
                  />
                </div>
                <div className="flex flex-col">
                  <CustomSelect
                    options={timeOptions}
                    selectedOption={timePeriod}
                    onOptionSelect={(option) =>
                      handleTimeChange(option as TimeOption)
                    }
                    showImages={false}
                    showText={true}
                  />
                </div>
              </div>
              <div className="w-full h-px my-3" />
              <LeverageSlider
                step={1}
                max={1000}
                min={1}
                initialValue={1}
                value={parseInt(lockDuration) || 0}
                onChange={(value) => setLockDuration(value.toString())}
                isLongPosition={true}
                unit={timePeriod.toLowerCase()}
              />
              <div className="w-full h-px my-3" />
            </>
          ) : (
            <>
              <div className="flex flex-col md:flex-row justify-between items-center mt-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-15 text-gray-text">
                    Available LP
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <p className="font-semibold text-white">
                      {formatFloatWithCommas(userDepositTokens)}
                      <span className="text-base font-medium text-printer-gray">
                        {`/ ${formatFloatWithCommas(totalAvailableLpTokens)}`}
                      </span>
                    </p>
                    <CustomTooltip
                      content={
                        <LiquidityTooltip
                          indexTokenSymbol={marketDetails.ticker.split(":")[0]}
                          totalAvailableLpTokens={totalAvailableLpTokens}
                          userDepositTokens={userDepositTokens}
                          availableLiquidity={availableLiquidity}
                        />
                      }
                      containerPadding={20}
                      placement="right-start"
                    >
                      <div className="relative">
                        <FaRegQuestionCircle className="w-4 h-4 text-white cursor-help" />
                      </div>
                    </CustomTooltip>
                  </div>
                </div>
                <div className="hidden md:flex h-16 w-px bg-divider" />
                <div className="flex flex-col gap-2 items-end">
                  <div className="flex items-center gap-2 text-15 text-gray-text">
                    XP Earned
                  </div>
                  <p className="font-semibold text-printer-green">
                    XP 4,343,434
                  </p>
                </div>
              </div>
              <InputField
                readOnly={false}
                value={collateral}
                onChange={handleInputChange}
                className="mt-2"
                renderContent={
                  <div className="flex flex-row gap-2 items-center font-medium text-lg">
                    <img
                      src={getImageUrlfromTokenSymbol(
                        marketDetails.ticker.split(":")[0]
                      )}
                      width={24}
                      height={24}
                      alt={`${marketDetails.ticker.split(":")[0]} Logo`}
                      className="rounded-full"
                    />
                    <p>{marketDetails.poolSymbol}</p>
                  </div>
                }
                renderBalance={
                  <p className="text-xs">
                    Balance :{" "}
                    <span className="font-medium">{userDepositTokens}</span>
                  </p>
                }
                renderTitle={
                  <p className="text-xs ">{`Unlock & Withdraw: $${
                    isNaN(parseFloat(collateral) * prices.lpTokenPrice)
                      ? "0.00"
                      : (parseFloat(collateral) * prices.lpTokenPrice).toFixed(
                          2
                        )
                  }`}</p>
                }
                setMax={() => {
                  setCollateral(userDepositTokens.toString());
                }}
              />

              <InputField
                readOnly={true}
                value={
                  isNaN(equivalentValues.equivalentTokens)
                    ? "0.00"
                    : equivalentValues.equivalentTokens.toString()
                }
                onChange={(e) => {}}
                className="mt-2"
                renderContent={
                  <div className="flex flex-row items-center gap-2 font-medium text-lg">
                    <img
                      src={getImageUrlfromTokenSymbol(
                        collateralType === "ETH"
                          ? selectedCurrency
                          : collateralType
                      )}
                      width={24}
                      height={24}
                      alt={`${
                        collateralType === "ETH"
                          ? selectedCurrency
                          : collateralType
                      } Logo`}
                      className="rounded-full"
                    />
                    {/* Only 2 possible paths: ETH = Select between ETH and WETH, or USDC */}
                    {collateralType === "ETH" ? (
                      <CustomSelect
                        options={["ETH", "WETH"]}
                        selectedOption={selectedCurrency}
                        onOptionSelect={setSelectedCurrency}
                        showImages={true}
                        showText={false}
                      />
                    ) : (
                      <span className="font-bold text-printer-gray hidden md:block">
                        {collateralType}
                      </span>
                    )}
                  </div>
                }
                hideMax={true}
                renderTitle={<p className=" text-xs ">Receive</p>}
              />
              <MyLockedAssets
                selectLock={handleSelectLock}
                activeLocks={activeLocks}
                fetchActiveLocks={fetchActiveLocks}
                indexTokenSymbol={marketDetails.ticker.split(":")[0]}
                lpTokenPrice={prices.lpTokenPrice}
              />
            </>
          )}

          <div className="w-full h-px bg-divider" />
          <div className="flex flex-col gap-2 py-4">
            <p className="text-white font-medium text-lg md:text-xl">Fees</p>
            <div className="flex justify-between items-center text-gray-text text-15">
              <p>{`${
                activeTab === tabs[0].value ? "Deposit" : "Withdrawal"
              } Fee`}</p>
              <p>{`${
                isNaN(estimatedFee)
                  ? "0.00"
                  : estimatedFee.toFixed(collateralType === "USDC" ? 2 : 4)
              } ($${isNaN(feeUsd) ? "0.00" : feeUsd.toFixed(2)} USD)`}</p>
            </div>
            <div className="flex justify-between items-center text-gray-text text-15">
              <p>Execution Fee</p>
              <p>{`${executionFees.executionFee} ETH`}</p>
            </div>
            <div className="flex justify-between items-center text-gray-text text-15">
              <p>Price Update Fee</p>
              <p>{`${executionFees.priceUpdateFee.toFixed(18)} ETH`}</p>
            </div>
          </div>
          <div className="w-full">
            <Button
              onClick={() => handleFunctionCall()}
              disabled={transactionPending}
              className="bg-green-grad hover:bg-green-grad-hover  !rounded-3 border border-printer-green font-bold w-full"
            >
              {getButtonText()}
            </Button>
          </div>
        </div>
      </div>
      {transactionState.isOpen && (
        <TransactionPending
          isOpen={transactionState.isOpen}
          setIsOpen={(isOpen) => updateTransactionState({ isOpen })}
          steps={transactionSteps}
          currentStep={transactionState.currentStep}
          hasFailedAtCurrentStep={transactionState.hasFailedAtCurrentStep}
          onClose={closeTransactionModal}
        />
      )}
    </ModalV2>
  );
};

export default LiquidityModal;
