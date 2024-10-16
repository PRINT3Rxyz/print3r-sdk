import ModalClose from "../common/ModalClose";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@nextui-org/react";
import useWallet from "../../hooks/useWallet";
import {
  getEtherBalance,
  getPriceDecimals,
  getUsdcBalance,
  getWrappedEtherBalance,
} from "../../utils/web3/utils";
import {
  convertFromWei,
  convertToUsdc,
  convertToWei,
  expandDecimals,
} from "../../utils/web3/conversions";
import { Position } from "../../types/positions";
import { contractAddresses } from "../../utils/web3/contractAddresses";
import { helperToast } from "../../utils/common/helperToast";
import { getPositionFeeUsd } from "../../utils/positions/getPositionFeeUsd";
import { getExecutionFees } from "../../utils/web3/getExecutionFees";
import { getMarketTokenPrices } from "../../utils/web3/getMarketTokenPrices";
import { waitForExecution } from "../../utils/web3/waitForExecution";
import { PositionManagerABI } from "../../utils/web3/abis/PositionManager";
import { parseAbiItem } from "viem";
import TransactionPending from "../common/TransactionPending";
import TypeButton from "../interaction/TypeButton";
import { PiArrowDownFill, PiArrowRightFill } from "react-icons/pi";
import { estimateLiquidationPrice } from "../../utils/positions/estimateLiquidationPrice";
import SlippageDropdown from "../interaction/SlippageDropdown";
import CollateralInput from "../common/CollateralInput";
import { executeTransactions } from "../../utils/web3/executeTransactions";
import { RouterABI } from "../../utils/web3/abis/Router";
import { erc20Abi } from "viem";

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

const MIN_COLLATERAL_USD = 2;
const MAX_LEVERAGE = 1000;

const CollateralEdit = ({
  isDeposit,
  onClose,
  marketId,
  position,
  depositToken,
  triggerRefetchPositions,
  markPrice,
}: {
  isDeposit: boolean;
  onClose: () => void;
  marketId: `0x${string}`;
  position: Position;
  depositToken: string;
  triggerRefetchPositions: () => void;
  markPrice: number;
}) => {
  const [balance, setBalance] = useState("");

  const [collateral, setCollateral] = useState("");

  const [collateralType, setCollateralType] = useState("ETH");

  const [liqPriceAfter, setLiqPriceAfter] = useState(0);

  const [isValidWithdrawal, setIsValidWithdrawal] = useState(true);

  const lastCalculatedDecimals = useRef(30);

  const [leverages, setLeverages] = useState<{
    leverageBefore: number;
    leverageAfter: number;
  }>({
    leverageBefore: 0,
    leverageAfter: 0,
  });

  const [fees, setFees] = useState<{
    positionFee: number;
    executionFee: number;
    priceUpdateFee: number;
  }>({
    positionFee: 0,
    executionFee: 0,
    priceUpdateFee: 0,
  });

  // Used to handle conversions between value and token amounts
  const [equivalents, setEquivalents] = useState<{
    value: number;
    tokens: number;
  }>({
    value: 0,
    tokens: 0,
  });

  // Used to cache prices so they're not refetched constantly when calculating equivalents
  const [cachedPrices, setCachedPrices] = useState<{
    ethPrice: number;
    usdcPrice: number;
  }>({
    ethPrice: 0,
    usdcPrice: 0,
  });

  const [collateralPrice, setCollateralPrice] = useState(0);

  // Max Slippage
  const [selectedOption, setSelectedOption] = useState<string>("0.3");
  const [customValue, setCustomValue] = useState<string>("");

  const [isTransactionPendingModalOpen, setIsTransactionPendingModalOpen] =
    useState(false);

  const [currentStep, setCurrentStep] = useState(0);

  const [hasFailedAtCurrentStep, setHasFailedAtCurrentStep] = useState(false);

  const [isTransactionComplete, setIsTransactionComplete] = useState(false);

  const [isValidLeverage, setIsValidLeverage] = useState(true);
  const [leverageErrorMessage, setLeverageErrorMessage] = useState("");

  const [maxWithdrawable, setMaxWithdrawable] = useState(0);

  const { account, chainId, smartAccount } = useWallet();

  const longCollateralOptions = ["ETH", "WETH"];

  const slippageOptions = ["0.1", "0.3", "0.5", "1"];

  const handleCollateralChange = (value: string) => {
    setCollateral(value);

    if (!isDeposit) {
      const withdrawalAmountUsd = parseFloat(value) * collateralPrice;
      const remainingCollateralUsd = position.collateral - withdrawalAmountUsd;
      setIsValidWithdrawal(remainingCollateralUsd >= MIN_COLLATERAL_USD);
    }
  };

  const handleCollateralTypeChange = (option: string) => {
    if (position.isLong && (option === "ETH" || option === "WETH")) {
      setCollateralType(option);
    }
  };

  const handleMaxClick = () => {
    if (isDeposit) {
      setCollateral(balance);
    } else {
      setCollateral(maxWithdrawable.toString());
    }
  };

  const resetInputs = () => {
    setCollateral("");
    setSelectedOption("0.3");
    setCustomValue("");
  };

  const fetchFees = async () => {
    // Convert collateral delta to usd
    const collateralDeltaUsd = parseFloat(collateral) * collateralPrice;
    const positionFee = getPositionFeeUsd(collateralDeltaUsd);
    const executionFees = await getExecutionFees(chainId, "position", 0);

    setFees({
      positionFee,
      executionFee: convertFromWei(executionFees[0]),
      priceUpdateFee: convertFromWei(executionFees[1]),
    });
  };

  const resetExecutionModalState = () => {
    setIsTransactionPendingModalOpen(false);
    setCurrentStep(0);
    setHasFailedAtCurrentStep(false);
  };

  const handleFunctionCall = async () => {
    if (!account || !smartAccount) {
      helperToast.error("Account Not Connected!");
      return;
    }

    setIsTransactionPendingModalOpen(true);
    setCurrentStep(0);
    setHasFailedAtCurrentStep(false);
    setIsTransactionComplete(false);

    const isLong: boolean = position.isLong;

    const collateralDelta: bigint = isLong
      ? convertToWei(parseFloat(collateral))
      : convertToUsdc(parseFloat(collateral));

    const collateralToken = isLong
      ? contractAddresses[chainId].WETH
      : contractAddresses[chainId].USDC;

    const slippage: number =
      selectedOption === "Custom"
        ? parseFloat(customValue)
        : parseFloat(selectedOption);

    const expandedMaxSlippage = expandDecimals(slippage / 100, 30);

    const router = contractAddresses[chainId].ROUTER as `0x${string}`;

    try {
      const transactions = [];

      // Add approve transaction if needed
      if (depositToken !== "ETH" && isDeposit) {
        transactions.push({
          address: collateralToken as `0x${string}`,
          abi: erc20Abi,
          functionName: "approve",
          args: [router, collateralDelta],
        });
      }

      const executionFees = await getExecutionFees(chainId, "position", 0);

      const executionFee = executionFees[0] + executionFees[1];

      // Add createPositionRequest transaction
      transactions.push({
        address: router,
        abi: RouterABI,
        functionName: "createPositionRequest",
        args: [
          marketId,
          {
            ticker: position.symbol,
            collateralToken: collateralToken as `0x${string}`,
            collateralDelta: collateralDelta,
            sizeDelta: 0n,
            limitPrice: 0n,
            maxSlippage: expandedMaxSlippage,
            executionFee,
            isLong: isLong,
            isLimit: false,
            isIncrease: isDeposit,
            reverseWrap: collateralType === "ETH",
            triggerAbove: false,
          },
          {
            stopLossSet: false,
            takeProfitSet: false,
            stopLossPercentage: 0n,
            takeProfitPercentage: 0n,
            stopLossPrice: 0n,
            takeProfitPrice: 0n,
          },
        ],
        value:
          depositToken === "ETH"
            ? collateralDelta + executionFee
            : executionFee,
      });

      setCurrentStep(1);

      const receipts = await executeTransactions({
        transactions,
        smartAccount,
      });

      setCurrentStep(2);
      setIsTransactionComplete(true);

      const positionManager = contractAddresses[chainId]
        .POSITION_MANAGER as `0x${string}`;

      try {
        await waitForExecution(
          chainId,
          {
            contractAddress: positionManager,
            abi: PositionManagerABI,
            eventName: "ExecutePosition",
            args: { marketId },
            event: parseAbiItem(
              "event ExecutePosition(bytes32 indexed marketId, bytes32 indexed _orderKey, uint256 _fee, uint256 _feeDiscount)"
            ),
          },
          receipts[0].userOpHash as `0x${string}`
        );

        helperToast.success(
          `${isDeposit ? "Deposit" : "Withdrawal"} Request Successful ✅`
        );

        setTimeout(() => {
          triggerRefetchPositions();
          setIsTransactionPendingModalOpen(false);
        }, 3000);
      } catch (error) {
        helperToast.error(`Execution Failed: ${error}`);
      }
    } catch (error) {
      console.error(
        `${
          isDeposit ? "Deposit" : "Withdrawal"
        } Request Failed with Error: ${error}`
      );
      helperToast.error(
        `${isDeposit ? "Deposit" : "Withdrawal"} Request Failed: ${error}`
      );
      setHasFailedAtCurrentStep(true);
      setTimeout(() => {
        setIsTransactionPendingModalOpen(false);
        resetExecutionModalState();
      }, 3000);
    }

    onClose();
    resetInputs();
    resetExecutionModalState();
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        let balance;

        if (isDeposit) {
          if (position.isLong) {
            if (collateralType === "ETH") {
              balance = await getEtherBalance(chainId, account);
            } else {
              balance = await getWrappedEtherBalance(chainId, account);
            }
          } else {
            balance = await getUsdcBalance(chainId, account);
          }
          setBalance(balance);
        } else {
          // Convert from USD to respective token
          const maxWithdrawUsd = Math.max(
            position.collateral - MIN_COLLATERAL_USD,
            0
          );
          const maxWithdraw = maxWithdrawUsd / collateralPrice;
          setMaxWithdrawable(maxWithdraw);
        }
      }
    };

    fetchBalance();
  }, [
    account,
    collateralType,
    chainId,
    position.isLong,
    isDeposit,
    collateralPrice,
  ]);

  useEffect(() => {
    const updateCollateralPrice = async () => {
      let ethPrice = cachedPrices.ethPrice;
      let usdcPrice = cachedPrices.usdcPrice;

      if (ethPrice === 0 || usdcPrice === 0) {
        const prices = await getMarketTokenPrices();
        ethPrice = prices.ethPrice;
        usdcPrice = prices.usdcPrice;

        setCachedPrices({
          ethPrice,
          usdcPrice,
        });
      }

      const price =
        collateralType === "ETH" || collateralType === "WETH"
          ? ethPrice
          : usdcPrice;

      setCollateralPrice(price ?? 0);
    };

    updateCollateralPrice();
  }, [collateral, collateralType, chainId, cachedPrices]);

  // Refresh the fees whenever the modal is open
  useEffect(() => {
    fetchFees();
  }, []);

  // Check whether leverage after is within boundaries
  useEffect(() => {
    const checkLeverageBoundaries = () => {
      if (equivalents.value === 0) {
        setIsValidLeverage(true);
        setLeverageErrorMessage("");
        return;
      }

      let newLeverage;
      if (isDeposit) {
        newLeverage = position.size / (position.collateral + equivalents.value);
      } else {
        newLeverage = position.size / (position.collateral - equivalents.value);
      }

      if (newLeverage < 1.1) {
        setIsValidLeverage(false);
        setLeverageErrorMessage("Min Leverage 1.1x");
      } else if (newLeverage > MAX_LEVERAGE) {
        setIsValidLeverage(false);
        setLeverageErrorMessage(`Max Leverage ${MAX_LEVERAGE}x`);
      } else {
        setIsValidLeverage(true);
        setLeverageErrorMessage("");
      }
    };

    checkLeverageBoundaries();
  }, [
    equivalents.value,
    position.size,
    position.collateral,
    MAX_LEVERAGE,
    isDeposit,
  ]);

  useEffect(() => {
    setCollateralType(position.isLong ? "ETH" : "USDC");
  }, [position.isLong]);

  useEffect(() => {
    const calculateLiqPriceAfter = () => {
      const newLiqPrice = estimateLiquidationPrice({
        entryPrice: position.entryPrice, // Collateral Edit won't change entry price
        collateralUsd: position.collateral + equivalents.value,
        sizeUsd: position.size,
        isLong: position.isLong,
      });

      setLiqPriceAfter(newLiqPrice);
    };

    calculateLiqPriceAfter();
  }, [equivalents.value, position.liqPrice, markPrice]);

  useEffect(() => {
    const fetchEquivalents = async () => {
      let collateralUsd = 0;

      if (cachedPrices.ethPrice > 0 && cachedPrices.usdcPrice > 0) {
        collateralUsd = parseFloat(collateral) * collateralPrice;
      } else {
        const { ethPrice, usdcPrice } = await getMarketTokenPrices();

        collateralUsd =
          collateralType === "USDC"
            ? parseFloat(collateral) * usdcPrice
            : parseFloat(collateral) * ethPrice;

        setCachedPrices({
          ethPrice,
          usdcPrice,
        });
      }

      setEquivalents({
        value: isNaN(collateralUsd) ? 0 : collateralUsd,
        tokens: isNaN(parseFloat(collateral)) ? 0 : parseFloat(collateral),
      });
    };

    fetchEquivalents();
  }, [collateral, collateralType, chainId, cachedPrices]);

  useEffect(() => {
    const fetchLeverages = async () => {
      const leverageBefore = (position.size / position.collateral).toFixed(2);
      let leverageAfter;
      if (equivalents.value === 0) {
        leverageAfter = leverageBefore;
      } else {
        if (isDeposit) {
          leverageAfter = (
            position.size /
            (position.collateral + equivalents.value)
          ).toFixed(2);
        } else {
          leverageAfter = (
            position.size /
            (position.collateral - equivalents.value)
          ).toFixed(2);
        }
      }
      setLeverages({
        leverageBefore: parseFloat(leverageBefore),
        leverageAfter: parseFloat(leverageAfter),
      });
    };

    fetchLeverages();
  }, [collateral, equivalents.value, position.collateral, position.size]);

  const priceDecimals = useMemo(() => {
    const newDecimals = getPriceDecimals(markPrice);
    if (newDecimals !== lastCalculatedDecimals.current) {
      lastCalculatedDecimals.current = newDecimals;
      return newDecimals;
    }
    return lastCalculatedDecimals.current;
  }, [markPrice]);

  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <div className="flex flex-row w-full justify-between">
        <p className="text-xl font-bold">
          {isDeposit ? "Deposit Collateral" : "Withdraw Collateral"}
        </p>
        <ModalClose onClose={onClose} />
      </div>
      <div className="flex flex-row w-full items-center justify-between">
        <TypeButton
          type={isDeposit ? "Deposit" : "Withdraw"}
          isActive={true}
          onClick={() => {}}
        />
        <p className="text-sm text-base-gray">
          {isDeposit ? "My wallet balance:" : "Max Withdraw:"}{" "}
          <span className="font-bold">{`${
            isDeposit
              ? parseInt(balance).toFixed(position.isLong ? 4 : 2)
              : maxWithdrawable.toFixed(position.isLong ? 8 : 4)
          } ${collateralType}`}</span>
        </p>
      </div>
      <CollateralInput
        value={collateral}
        onValueChange={handleCollateralChange}
        collateralType={collateralType}
        onCollateralTypeChange={handleCollateralTypeChange}
        collateralOptions={longCollateralOptions}
        onMaxClick={handleMaxClick}
      />
      <div className="flex flex-col gap-2 py-6">
        <div className="flex flex-row justify-between text-sm text-gray-text">
          <span>Position Size</span>
          <span>{`$${position.size.toFixed(2)}`}</span>
        </div>

        <div className="flex flex-row justify-between text-sm text-gray-text">
          <span>Collateral Asset</span>
          <span>{position.isLong ? "ETH" : "USDC"}</span>
        </div>

        <div className="flex flex-row justify-between text-sm text-gray-text">
          <span>Collateral Value</span>
          <p
            className={`${
              isDeposit ? "text-printer-green" : "text-printer-red"
            } text-nowrap flex items-center`}
          >
            <span className="text-gray-text">{`$${position.collateral.toFixed(
              2
            )}`}</span>
            <PiArrowRightFill className="mx-1" />
            <span>{`$${(isDeposit
              ? position.collateral + equivalents.value
              : position.collateral - equivalents.value
            ).toFixed(2)}`}</span>
          </p>
        </div>

        <div className="flex flex-row justify-between text-sm text-gray-text">
          <span>Leverage</span>
          <p
            className={`${
              isDeposit ? "text-printer-green" : "text-printer-red"
            } text-nowrap flex items-center`}
          >
            <span className="text-gray-text">{leverages.leverageBefore}</span>
            <PiArrowRightFill className="mx-1" />
            <span>{leverages.leverageAfter}</span>
          </p>
        </div>

        <div className="flex flex-row items-stretch justify-between text-sm text-gray-text">
          <span className="flex flex-col justify-between text-wrap">
            <span>Current Liquidation Price</span>
            <PiArrowDownFill className="my-1" />
            <span>New Liquidation Price</span>
          </span>
          <p
            className={`${
              isDeposit ? "text-printer-green" : "text-printer-red"
            } flex flex-col items-end justify-between`}
          >
            <span className="text-gray-text">{`$${position.liqPrice.toFixed(
              priceDecimals
            )}`}</span>
            <PiArrowDownFill className="my-1" />
            <span>{`$${liqPriceAfter.toFixed(priceDecimals)}`}</span>
          </p>
        </div>

        <div className="flex flex-row justify-between text-sm text-gray-text">
          <span>Position Fee</span>
          <span>{fees.positionFee}</span>
        </div>
        <div className="flex flex-row justify-between text-sm text-gray-text">
          <span>Execution Fee</span>
          <span>{`${fees.executionFee} ETH`}</span>
        </div>
        <div className="flex flex-row justify-between text-sm text-gray-text">
          <span>Price Update Fee</span>
          <span>{`${fees.priceUpdateFee.toFixed(18)} ETH`}</span>
        </div>
        <div className="flex flex-row justify-between items-center text-sm text-gray-text">
          <span>Slippage</span>
          <SlippageDropdown
            options={slippageOptions}
            selectedOption={selectedOption}
            onOptionSelect={setSelectedOption}
          />
        </div>
        <div className="flex flex-row justify-between text-sm text-gray-text">
          <span>Mark Price</span>
          <span>{`$${markPrice.toFixed(priceDecimals)}`}</span>
        </div>
      </div>
      <div className="flex flex-row justify-between text-sm text-gray-text gap-4 items-center">
        <img src={"/img/info-tip.svg"} alt="Info Tip" width={24} height={24} />
        <p className="text-xs text-printer-gray">
          Depositing collateral helps to reduce the risk of your positon being
          liquidated by decreasing the liq price.
        </p>
      </div>
      <div className="py-4 pb-24 md:pb-0">
        <Button
          onClick={() => handleFunctionCall()}
          disabled={(!isDeposit && !isValidWithdrawal) || !isValidLeverage}
          className={`w-full flex items-center justify-center text-center text-base bg-p3-button hover:bg-p3-button-hover ${
            (!isDeposit && !isValidWithdrawal) || !isValidLeverage
              ? "cursor-not-allowed"
              : ""
          } border-2 border-p3 !rounded-3 text-white py-4 font-bold`}
        >
          {isDeposit
            ? isValidLeverage
              ? "Deposit"
              : leverageErrorMessage
            : isValidWithdrawal
            ? isValidLeverage
              ? "Withdraw"
              : leverageErrorMessage
            : "Min Collateral 2 USD"}
        </Button>
      </div>
      {isTransactionPendingModalOpen && (
        <TransactionPending
          isOpen={isTransactionPendingModalOpen}
          setIsOpen={setIsTransactionPendingModalOpen}
          steps={transactionSteps}
          currentStep={currentStep}
          hasFailedAtCurrentStep={hasFailedAtCurrentStep}
          onClose={() => {
            setIsTransactionPendingModalOpen(false);
            setCurrentStep(0);
            setHasFailedAtCurrentStep(false);
          }}
        />
      )}
    </div>
  );
};

export default CollateralEdit;
