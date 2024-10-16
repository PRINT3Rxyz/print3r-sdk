// price at which losses exceed collateral
export const estimateLiquidationPrice = ({
  entryPrice,
  collateralUsd,
  sizeUsd,
  isLong,
}: {
  entryPrice: number;
  collateralUsd: number;
  sizeUsd: number;
  isLong: boolean;
}) => {
  if (sizeUsd === 0) {
    return 0.0;
  }

  const lossRatio = collateralUsd / sizeUsd;

  let liquidationPrice: number;

  if (isLong) {
    liquidationPrice = entryPrice * (1 - lossRatio);
  } else {
    liquidationPrice = entryPrice * (1 + lossRatio);
  }

  return liquidationPrice;
};
