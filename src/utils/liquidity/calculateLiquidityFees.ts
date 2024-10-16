import { expandDecimals } from "../web3/conversions";

export const BASE_FEE = 0.001; // 0.1%
export const FEE_SCALE = 0.01; // 1%
const LONG_BASE_UNIT = expandDecimals(1, 18);
const SHORT_BASE_UNIT = expandDecimals(1, 6);

// Helper function to simulate Solidity's percentage calculation
const percentage = (value: number, percent: number): number => {
  return value * percent;
};

// Helper function to simulate Solidity's toUsd conversion
const toUsd = (amount: number, price: number, baseUnit: number): number => {
  return (amount * price) / baseUnit;
};

// Helper function to simulate Solidity's diff
const diff = (a: number, b: number): number => {
  return Math.abs(a - b);
};

export const calculateDepositFee = (
  longTokenPrice: number,
  shortTokenPrice: number,
  longTokenBalance: number,
  shortTokenBalance: number,
  tokenAmount: number,
  isLongToken: boolean
): number => {
  const baseFee = percentage(tokenAmount, BASE_FEE);

  if (longTokenBalance === 0 && isLongToken) return baseFee;
  if (shortTokenBalance === 0 && !isLongToken) return baseFee;

  // Maximize to increase the impact on the skew
  const amountUsd = isLongToken
    ? toUsd(tokenAmount, longTokenPrice, Number(LONG_BASE_UNIT))
    : toUsd(tokenAmount, shortTokenPrice, Number(SHORT_BASE_UNIT));

  if (amountUsd === 0) return baseFee;

  // Minimize value of pool to maximise the effect on the skew
  let longValue = toUsd(
    longTokenBalance,
    longTokenPrice,
    Number(LONG_BASE_UNIT)
  );
  let shortValue = toUsd(
    shortTokenBalance,
    shortTokenPrice,
    Number(SHORT_BASE_UNIT)
  );

  // Don't want to disincentivise deposits on empty pool
  if (longValue === 0 && isLongToken) return baseFee;
  if (shortValue === 0 && !isLongToken) return baseFee;

  const initSkew = diff(longValue, shortValue);
  isLongToken ? (longValue += amountUsd) : (shortValue += amountUsd);
  const updatedSkew = diff(longValue, shortValue);

  // Check for a Skew Flip
  const skewFlip = Math.sign(initSkew) !== Math.sign(updatedSkew);

  // If No Flip + Skew Improved - Charge the Base fee
  if (Math.abs(updatedSkew) < Math.abs(initSkew) && !skewFlip) return baseFee;

  // If Flip, charge full Skew After, else charge the delta
  const negativeSkewAccrued = skewFlip ? Math.abs(updatedSkew) : amountUsd;

  // Calculate the relative impact on Market Skew
  const feeFactor = percentage(
    FEE_SCALE,
    negativeSkewAccrued / (longValue + shortValue)
  );

  // Calculate the additional fee
  const feeAddition = percentage(tokenAmount, feeFactor);

  return baseFee + feeAddition;
};

export const calculateWithdrawalFee = (
  longPrice: number,
  shortPrice: number,
  longTokenBalance: number,
  shortTokenBalance: number,
  tokenAmount: number,
  isLongToken: boolean
): number => {
  const baseFee = percentage(tokenAmount, BASE_FEE);

  if (longTokenBalance === 0 && isLongToken) return baseFee;
  if (shortTokenBalance === 0 && !isLongToken) return baseFee;

  // Maximize to increase the impact on the skew
  const amountUsd = isLongToken
    ? toUsd(tokenAmount, longPrice, Number(LONG_BASE_UNIT))
    : toUsd(tokenAmount, shortPrice, Number(SHORT_BASE_UNIT));

  if (amountUsd === 0) return BASE_FEE;

  // Minimize value of pool to maximise the effect on the skew
  let longValue = toUsd(longTokenBalance, longPrice, Number(LONG_BASE_UNIT));
  let shortValue = toUsd(
    shortTokenBalance,
    shortPrice,
    Number(SHORT_BASE_UNIT)
  );

  const initSkew = diff(longValue, shortValue);
  isLongToken ? (longValue -= amountUsd) : (shortValue -= amountUsd);
  const updatedSkew = diff(longValue, shortValue);

  if (longValue + shortValue === 0) {
    // Charge the maximum possible fee for full withdrawals
    return baseFee + percentage(tokenAmount, FEE_SCALE);
  }

  // Check for a Skew Flip
  const skewFlip = Math.sign(initSkew) !== Math.sign(updatedSkew);

  // If No Flip + Skew Improved - Charge the Base fee
  if (Math.abs(updatedSkew) < Math.abs(initSkew) && !skewFlip) return baseFee;

  // If Flip, charge full Skew After, else charge the delta
  const negativeSkewAccrued = skewFlip ? Math.abs(updatedSkew) : amountUsd;

  // Calculate the relative impact on Market Skew
  // Re-add amount to get the initial net pool value
  const feeFactor = percentage(
    FEE_SCALE,
    negativeSkewAccrued / (longValue + shortValue + amountUsd)
  );

  // Calculate the additional fee
  const feeAddition = percentage(tokenAmount, feeFactor);

  return baseFee + feeAddition;
};
