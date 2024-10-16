import { contractDecimals } from "../web3/conversions";

export const calculateRealizedPnl = (
  entryPrice: bigint,
  exitPrice: bigint,
  size: bigint,
  isLong: boolean
): number => {
  const entryPriceUsd = contractDecimals(entryPrice, 30);
  const exitPriceUsd = contractDecimals(exitPrice, 30);
  const sizeUsd = contractDecimals(size, 30);

  let realizedPnl: number;
  if (isLong) {
    realizedPnl = (sizeUsd * (exitPriceUsd - entryPriceUsd)) / entryPriceUsd;
  } else {
    realizedPnl = (sizeUsd * (entryPriceUsd - exitPriceUsd)) / entryPriceUsd;
  }

  return parseFloat(realizedPnl.toFixed(2));
};
