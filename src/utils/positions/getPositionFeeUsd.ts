import {
  POSITION_FEE_BASIS_POINTS,
  TAKERS_FEE_BASIS_POINTS,
} from "../common/constants";
import { contractDecimals, expandDecimals } from "../web3/conversions";

export const getPositionFeeUsd = (
  sizeUsd: number,
  hasStopLoss: boolean = false, // False by default
  stopLossPercentage: number = 0, // between 0 and 100
  hasTakeProfit: boolean = false, // False by default
  takeProfitPercentage: number = 0, // between 0 and 100
  isTaker: boolean = false
): number => {
  const sizeUsdFixed = expandDecimals(sizeUsd, 30);

  // Calculate base position fee
  const baseFeeAmountFixed = isTaker
    ? (sizeUsdFixed * BigInt(TAKERS_FEE_BASIS_POINTS)) / BigInt(10000)
    : (sizeUsdFixed * BigInt(POSITION_FEE_BASIS_POINTS)) / BigInt(10000);

  let totalFeeAmountFixed = baseFeeAmountFixed;

  // Calculate and add stop loss fee if applicable
  if (hasStopLoss) {
    const stopLossSizeUsdFixed =
      (sizeUsdFixed * BigInt(Math.round(stopLossPercentage * 100))) /
      BigInt(10000);
    const stopLossFeeFixed = isTaker
      ? (stopLossSizeUsdFixed * BigInt(TAKERS_FEE_BASIS_POINTS)) / BigInt(10000)
      : (stopLossSizeUsdFixed * BigInt(POSITION_FEE_BASIS_POINTS)) /
        BigInt(10000);
    totalFeeAmountFixed += stopLossFeeFixed;
  }

  // Calculate and add take profit fee if applicable
  if (hasTakeProfit) {
    const takeProfitSizeUsdFixed =
      (sizeUsdFixed * BigInt(Math.round(takeProfitPercentage * 100))) /
      BigInt(10000);
    const takeProfitFeeFixed = isTaker
      ? (takeProfitSizeUsdFixed * BigInt(TAKERS_FEE_BASIS_POINTS)) /
        BigInt(10000)
      : (takeProfitSizeUsdFixed * BigInt(POSITION_FEE_BASIS_POINTS)) /
        BigInt(10000);
    totalFeeAmountFixed += takeProfitFeeFixed;
  }

  const totalFeeAmount = contractDecimals(totalFeeAmountFixed, 30);

  return totalFeeAmount;
};
