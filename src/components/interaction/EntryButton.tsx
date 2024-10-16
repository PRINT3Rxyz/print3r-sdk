import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, useDisclosure } from "@nextui-org/react";
import { contractAddresses } from "../../utils/web3/contractAddresses";
import useWallet from "../../hooks/useWallet";
import {
  contractDecimals,
  convertToUsdc,
  convertToWei,
  expandDecimals,
} from "../../utils/web3/conversions";
import ConnectWallet from "../nav/ConnectWallet";
import { getAvailableLiquidity } from "../../utils/web3/getAvailableLiquidity";
import { helperToast } from "../../utils/common/helperToast";
import PercentageButtons from "./PercentageButtons";
import { waitForExecution } from "../../utils/web3/waitForExecution";
import { PositionManagerABI } from "../../utils/web3/abis/PositionManager";
import { erc20Abi, parseAbiItem } from "viem";
import TransactionPending from "../../components/common/TransactionPending";
import ModalClose from "../../components/common/ModalClose";
import { useAsset } from "../assets/AssetContext";
import ModalV2 from "../../components/common/ModalV2";
import { getPriceDecimals } from "../../utils/web3/utils";
import LiquidityModal from "../liquidity/LiquidityModal";
import { formatFloatWithCommas } from "../../utils/common/formatters";
import CustomTooltip from "../../components/common/CustomTooltip";
import { FaRegQuestionCircle } from "react-icons/fa";
import { Position } from "../../types/positions";
import { v4 as uuidv4 } from "uuid";
import { executeTransactions } from "../../utils/web3/executeTransactions";
import { RouterABI } from "../../utils/web3/abis/Router";

type EntryButtonProps = {
  marketId: `0x${string}`;
  isLong: boolean;
  isLimit: boolean;
  isTrigger: boolean;
  ticker: string;
  leverage: number;
  collateralToken: string;
  collateralDelta: number;
  collateralDeltaUsd: number;
  sizeDelta: number;
  limitPrice: number;
  isIncrease: boolean;
  reverseWrap: boolean;
  stopLossSet: boolean;
  takeProfitSet: boolean;
  stopLossPercentage: number;
  takeProfitPercentage: number;
  stopLossPrice: number;
  takeProfitPrice: number;
  entryPrice: number;
  positionFee: number;
  executionFees: {
    executionFee: number;
    priceUpdateFee: number;
  };
  liqPrice: number;
  priceImpact: number;
  collateralPrices: {
    ethPrice: number;
    usdcPrice: number;
  };
  triggerRefetchPositions: () => void;
  resetInputs: () => void;
  fetchExecutionFees: () => void;
  triggerRefreshVolume: () => void;
  updateMarketStats: () => void;
  createPendingPosition: (position: Position) => void;
  refreshPendingPosition: (id: string, success: boolean) => void;
};

const marketOrderSteps = [
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
];

const limitOrderSteps = [
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
];

const EntryButton: React.FC<EntryButtonProps> = ({
  marketId,
  isLong,
  isLimit,
  isTrigger,
  ticker,
  leverage,
  collateralToken,
  collateralDelta,
  collateralDeltaUsd,
  sizeDelta,
  limitPrice,
  isIncrease,
  reverseWrap,
  stopLossSet,
  takeProfitSet,
  stopLossPercentage,
  takeProfitPercentage,
  stopLossPrice,
  takeProfitPrice,
  entryPrice,
  positionFee,
  executionFees,
  liqPrice,
  priceImpact,
  collateralPrices,
  triggerRefetchPositions,
  resetInputs,
  fetchExecutionFees,
  triggerRefreshVolume,
  updateMarketStats,
  createPendingPosition,
  refreshPendingPosition,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { asset } = useAsset();
  const {
    account,
    chainId,
    active,
    client: walletClient,
    smartAccount,
  } = useWallet();

  const [state, setState] = useState({
    selectedOption: "0.3",
    customValue: "",
    availableLiquidity: 0,
    isTransactionPendingModalOpen: false,
    currentStep: 0,
    hasFailedAtCurrentStep: false,
    isTransactionComplete: false,
    positionFeeInCollateral: 0,
    isButtonDisabled: false,
    disabledText: "",
  });

  const [isLiquidityModalOpen, setIsLiquidityModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const updateState = (newState: Partial<typeof state>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  const resetModalState = useCallback(() => {
    updateState({ selectedOption: "0.3", customValue: "" });
  }, []);

  const resetExecutionModalState = useCallback(() => {
    updateState({
      isTransactionPendingModalOpen: false,
      currentStep: 0,
      hasFailedAtCurrentStep: false,
    });
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    resetModalState();
  }, [onClose, resetModalState]);

  const handleOpen = useCallback(() => {
    if (
      collateralDelta > 0 &&
      !Number.isNaN(collateralDelta) &&
      !state.isButtonDisabled
    ) {
      onOpen();
    }
  }, [collateralDelta, state.isButtonDisabled, onOpen]);

  const executePosition = useCallback(async () => {
    updateState({
      isTransactionPendingModalOpen: true,
      currentStep: 0,
      hasFailedAtCurrentStep: false,
      isTransactionComplete: false,
    });

    let collateralDeltaNative: bigint;

    const sizeDeltaP30: bigint = expandDecimals(sizeDelta, 30);
    const limitPriceP30: bigint = isNaN(limitPrice)
      ? 0n
      : expandDecimals(limitPrice, 30);
    const slippage: number =
      state.selectedOption === "Custom"
        ? parseFloat(state.customValue)
        : parseFloat(state.selectedOption);
    const maxSlippageP30: bigint = expandDecimals(slippage / 100, 30);
    const stopLossPriceP30: bigint = expandDecimals(stopLossPrice, 30);
    const takeProfitPriceP30: bigint = expandDecimals(takeProfitPrice, 30);

    let stopLossPercentageP18: bigint = convertToWei(stopLossPercentage) / 100n;
    let takeProfitPercentageP18: bigint =
      convertToWei(takeProfitPercentage) / 100n;

    if (stopLossSet && stopLossPercentage === 0) {
      stopLossPercentageP18 = expandDecimals(1, 18);
    }

    if (takeProfitSet && takeProfitPercentage === 0) {
      takeProfitPercentageP18 = expandDecimals(1, 18);
    }

    let collateralAddress: `0x${string}` = contractAddresses[chainId][
      collateralToken
    ] as `0x${string}`;
    const totalCollateralDelta =
      collateralDelta + state.positionFeeInCollateral;

    if (collateralAddress === contractAddresses[chainId].USDC) {
      collateralDeltaNative = convertToUsdc(totalCollateralDelta);
    } else {
      collateralDeltaNative = convertToWei(totalCollateralDelta);
    }

    const triggerAbove = isLimit
      ? !isLong
      : takeProfitSet
      ? isLong
      : stopLossSet
      ? !isLong
      : false;

    if (!account || !smartAccount) {
      throw new Error("Account Not Connected!");
    }

    const router = contractAddresses[chainId].ROUTER as `0x${string}`;

    const executionFee = expandDecimals(
      executionFees.executionFee + executionFees.priceUpdateFee,
      18
    );

    try {
      const transactions = [];

      // Add approve transaction if needed
      if (collateralToken !== "ETH") {
        transactions.push({
          address: collateralAddress,
          abi: erc20Abi,
          functionName: "approve",
          args: [router, collateralDeltaNative],
        });
      }

      // Add createPositionRequest transaction
      transactions.push({
        address: router,
        abi: RouterABI,
        functionName: "createPositionRequest",
        args: [
          marketId,
          {
            ticker,
            collateralToken: collateralAddress,
            collateralDelta: collateralDeltaNative,
            sizeDelta: sizeDeltaP30,
            limitPrice: limitPriceP30,
            maxSlippage: maxSlippageP30,
            executionFee,
            isLong,
            isLimit,
            isIncrease,
            reverseWrap,
            triggerAbove,
          },
          {
            stopLossSet,
            takeProfitSet,
            stopLossPercentage: stopLossPercentageP18,
            takeProfitPercentage: takeProfitPercentageP18,
            stopLossPrice: stopLossPriceP30,
            takeProfitPrice: takeProfitPriceP30,
          },
        ],
        value:
          collateralToken === "ETH"
            ? collateralDeltaNative + executionFee
            : executionFee,
      });

      console.log("transactions", transactions);

      updateState({ currentStep: 1 });

      const receipts = await executeTransactions({
        transactions,
        smartAccount,
      });

      updateState({ currentStep: 2, isTransactionComplete: true });
      triggerRefetchPositions();
      triggerRefreshVolume();
      updateState({ isTransactionPendingModalOpen: false });
      handleClose();
      resetInputs();
      resetExecutionModalState();

      if (isLimit) {
        helperToast.success("Order Successful ✅");
        return;
      }

      const id = uuidv4();
      createPendingPosition({
        id: id,
        isPending: true,
        marketId: marketId,
        symbol: ticker,
        isLong: isLong,
        size: sizeDelta,
        collateral: Number((sizeDelta / leverage).toFixed(2)),
        entryPrice: 0,
        entryTime: new Date().toISOString(),
        liqPrice: liqPrice,
        adlEvents: [],
        positionKey: "0x0",
      });

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

        helperToast.success("Execution Successful ✅");
        setTimeout(() => {
          refreshPendingPosition(id, true);
          updateMarketStats();
        }, 3000);
      } catch (error) {
        helperToast.error(`Execution Failed: ${error}`);
        refreshPendingPosition(id, false);
      }
    } catch (error) {
      console.error(`Create Position Request Failed with Error: ${error}`);
      helperToast.error(`Create Position Request Failed: ${error}`);
      updateState({ hasFailedAtCurrentStep: true });
      setTimeout(() => {
        updateState({ isTransactionPendingModalOpen: false });
        resetExecutionModalState();
      }, 3000);
    }
  }, [
    state.selectedOption,
    state.customValue,
    state.positionFeeInCollateral,
    marketId,
    isLong,
    isLimit,
    ticker,
    leverage,
    collateralToken,
    collateralDelta,
    sizeDelta,
    limitPrice,
    isIncrease,
    reverseWrap,
    stopLossSet,
    takeProfitSet,
    stopLossPercentage,
    takeProfitPercentage,
    stopLossPrice,
    takeProfitPrice,
    chainId,
    account,
    walletClient,
    onClose,
    resetInputs,
    resetExecutionModalState,
    triggerRefetchPositions,
    handleClose,
  ]);

  useEffect(() => {
    const fetchAvailableLiquidity = async () => {
      if (!marketId || marketId.length !== 66) return;

      const collateralPrice = isLong
        ? collateralPrices.ethPrice
        : collateralPrices.usdcPrice;
      const liquidity: bigint = await getAvailableLiquidity({
        chainId,
        marketId,
        indexPrice: entryPrice,
        collateralPrice,
        isLong,
      });

      const liquidityFloat = contractDecimals(liquidity, 30);
      updateState({ availableLiquidity: liquidityFloat });
    };

    fetchAvailableLiquidity();
  }, [asset, marketId, chainId, isLong, collateralPrices, entryPrice]);

  useEffect(() => {
    if (isOpen) {
      fetchExecutionFees();
    }
  }, [isOpen, fetchExecutionFees]);

  useEffect(() => {
    const checkButtonState = () => {
      let isDisabled = false;
      let text = "";

      if (collateralDeltaUsd === 0 || Number.isNaN(collateralDeltaUsd)) {
        isDisabled = true;
        text = "Enter an Amount";
      } else if (collateralDeltaUsd < 2) {
        isDisabled = true;
        text = "Min Trade Size 2 USD";
      } else if (sizeDelta > state.availableLiquidity) {
        isDisabled = true;
        text = "Insufficient Liquidity";
      } else {
        // Calculate max slippage based on selected option
        const slippagePercent =
          state.selectedOption === "Custom"
            ? parseFloat(state.customValue)
            : parseFloat(state.selectedOption);

        if (!isNaN(slippagePercent)) {
          const maxSlippageUsd = (slippagePercent / 100) * collateralDeltaUsd;
          if (priceImpact < 0 && Math.abs(priceImpact) > maxSlippageUsd) {
            isDisabled = true;
            text = "Slippage Exceeds Max";
          }
        } else {
          isDisabled = true;
          text = "Invalid Slippage";
        }
      }

      updateState({ isButtonDisabled: isDisabled, disabledText: text });
    };

    checkButtonState();
  }, [
    collateralDeltaUsd,
    sizeDelta,
    state.availableLiquidity,
    priceImpact,
    state.selectedOption,
    state.customValue,
  ]);

  useEffect(() => {
    const fetchPositionFeeInCollateral = async () => {
      const collateralPrice = isLong
        ? collateralPrices.ethPrice
        : collateralPrices.usdcPrice;
      const positionFeeInCollateral = positionFee / collateralPrice;
      updateState({ positionFeeInCollateral });
    };

    fetchPositionFeeInCollateral();
  }, [positionFee, collateralPrices, isLong]);

  useEffect(() => {
    setCountdown(5);
    const timer = setInterval(() => {
      setCountdown((prevCount) => (prevCount > 0 ? prevCount - 1 : 5));
    }, 1000);

    return () => clearInterval(timer);
  }, [entryPrice]);

  const buttonText = useMemo(() => {
    if (state.isButtonDisabled) return state.disabledText;
    if (collateralDeltaUsd < 2) return "Min Trade Size 2 USD";
    if (isTrigger) return "Create Trigger Order";
    return `${isLimit ? "Limit" : "Market"} ${isLong ? "Long" : "Short"} ${
      ticker.split(":")[0]
    }`;
  }, [
    state.isButtonDisabled,
    state.disabledText,
    collateralDeltaUsd,
    isTrigger,
    isLimit,
    isLong,
    ticker,
  ]);

  const getDisplayPrice = (price: number) => {
    const priceDecimals = getPriceDecimals(price);
    return price.toFixed(priceDecimals);
  };

  const getCountdownColor = (seconds: number) => {
    if (seconds >= 4) return "text-printer-green";
    if (seconds === 3) return "text-printer-orange";
    return "text-printer-red";
  };

  const calculateProjectedEarnings = useCallback(() => {
    const targetPrice = takeProfitSet ? takeProfitPrice : entryPrice * 1.2;
    const profitPercentage = ((targetPrice - entryPrice) / entryPrice) * 100;
    return {
      earnings: (sizeDelta * (profitPercentage / 100)).toFixed(2),
      targetPrice,
      profitPercentage,
    };
  }, [takeProfitSet, takeProfitPrice, entryPrice, sizeDelta]);

  const renderButton = () => {
    if (
      state.isButtonDisabled &&
      state.disabledText === "Insufficient Liquidity"
    ) {
      return (
        <Button
          onPress={() => setIsLiquidityModalOpen(true)}
          className="w-full flex items-center justify-center text-center text-base bg-p3-button hover:bg-p3-button-hover border-2 border-p3 !rounded-3 text-white py-4 font-bold"
        >
          {state.disabledText}
        </Button>
      );
    }

    return (
      <Button
        onPress={active && !state.isButtonDisabled ? handleOpen : undefined}
        disabled={state.isButtonDisabled}
        className={`w-full flex items-center justify-center text-center text-base bg-p3-button hover:bg-p3-button-hover ${
          state.isButtonDisabled ? " cursor-not-allowed" : ""
        } border-2 border-p3 !rounded-3 text-white py-4 font-bold`}
      >
        {buttonText}
      </Button>
    );
  };

  return (
    <>
      {active ? (
        renderButton()
      ) : (
        <ConnectWallet styles="w-full flex items-center justify-center text-center text-base bg-p3-button hover:bg-p3-button-hover border-2 border-p3 !rounded-3 text-white py-4 font-bold " />
      )}
      <ModalV2 isOpen={isOpen} setIsModalOpen={onClose} size="lg">
        <div className="flex flex-col gap-4 w-full h-full pb-12 md:pb-6 p-6">
          <div className="flex flex-row justify-between w-full items-center mb-4">
            <p className="text-lg font-bold">Confirm Order</p>
            <ModalClose onClose={onClose} />
          </div>
          <div className="h-px w-full bg-gray-text" />
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-row justify-between w-full text-gray-text">
              <p>Leverage</p>
              <p>{leverage}x</p>
            </div>
            <PercentageButtons
              title="Max Slippage"
              options={["0.1", "0.3", "0.5", "1", "Custom"]}
              isLong={isLong}
              selectedOption={state.selectedOption}
              setSelectedOption={(option) =>
                updateState({ selectedOption: option })
              }
              customValue={state.customValue}
              setCustomValue={(value) => updateState({ customValue: value })}
            />
            <div className="flex justify-between items-center text-gray-text">
              <p>Entry Price</p>
              <p>{`$${getDisplayPrice(entryPrice)}`}</p>
            </div>
            <div className="flex justify-between items-center text-gray-text w-full">
              <p>Price reserved for the next:</p>
              <p className={`font-bold ${getCountdownColor(countdown)}`}>
                {countdown}s
              </p>
            </div>
            <div className="flex justify-between items-center text-gray-text">
              <p>Liq Price</p>
              <p>{`$${getDisplayPrice(liqPrice)}`}</p>
            </div>
            <div className="h-px w-full bg-gray-text" />
            <div className="flex justify-between items-center text-gray-text">
              <p>{`Collateral in (including fee)`}</p>
              <p>{collateralDelta + state.positionFeeInCollateral}</p>
            </div>
            <div className="flex justify-between items-center text-gray-text">
              <p>Position Fee</p>
              <p>{`$${positionFee.toFixed(4)}`}</p>
            </div>
            <div className="flex justify-between items-center text-gray-text">
              <p>Execution Fee</p>
              <p>{`${executionFees.executionFee} ETH`}</p>
            </div>
            <div className="flex justify-between items-center text-gray-text">
              <p>Price Update Fee</p>
              <p>{`${executionFees.priceUpdateFee.toFixed(18)} ETH`}</p>
            </div>
            <div className="flex justify-between items-center text-gray-text">
              <p>Price Impact</p>
              <p>
                {priceImpact > 0 ? "+$" : "$"}
                {priceImpact.toFixed(2)}
              </p>
            </div>
            <div className="h-px w-full bg-gray-text" />
            <div className="flex justify-between items-center text-gray-text">
              <p>Projected Earnings</p>
              <CustomTooltip
                content={
                  <span>
                    Estimated profit if price hits $
                    {calculateProjectedEarnings().targetPrice.toFixed(2)}, or a{" "}
                    {calculateProjectedEarnings().profitPercentage.toFixed(2)}%
                    price move in the favourable direction.
                  </span>
                }
                placement="top"
              >
                <div className="flex gap-2 items-center">
                  <FaRegQuestionCircle className="text-white" />
                  <p className="text-printer-green font-bold cursor-help">
                    $
                    {formatFloatWithCommas(
                      parseFloat(calculateProjectedEarnings().earnings)
                    )}
                  </p>
                </div>
              </CustomTooltip>
            </div>
          </div>

          <Button
            type="submit"
            onPress={executePosition}
            disabled={!active}
            className="w-full flex items-center justify-center text-center text-base bg-green-grad hover:bg-green-grad-hover border-2 border-printer-green !rounded-3 text-white !py-4 md:py-6 font-bold"
          >
            Execute
          </Button>
          {state.isTransactionPendingModalOpen && (
            <TransactionPending
              isOpen={state.isTransactionPendingModalOpen}
              setIsOpen={(isOpen) =>
                updateState({ isTransactionPendingModalOpen: isOpen })
              }
              steps={isLimit ? limitOrderSteps : marketOrderSteps}
              currentStep={state.currentStep}
              hasFailedAtCurrentStep={state.hasFailedAtCurrentStep}
              onClose={resetExecutionModalState}
            />
          )}
        </div>
      </ModalV2>
      <LiquidityModal
        isModalOpen={isLiquidityModalOpen}
        setIsModalOpen={setIsLiquidityModalOpen}
        handleBackClick={() => setIsLiquidityModalOpen(false)}
        collateralType={collateralToken}
        marketId={marketId}
        refreshTableData={async () => {
          updateMarketStats();
        }}
      />
    </>
  );
};

export default EntryButton;
