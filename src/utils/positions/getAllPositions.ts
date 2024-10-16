import { ClosedPosition, Order, Position } from "../../types/positions";
import { getPosition } from "../web3/getPosition";
import { contractDecimals } from "../web3/conversions";
import { estimateLiquidationPrice } from "./estimateLiquidationPrice";
import { formatUnixTimestamp } from "../web3/utils";
import { getOrder } from "../web3/getOrder";
import { calculateRealizedPnl } from "./calculatePnl";
import { getNameFromChainId } from "../web3/config";

export const getAllPositions = async (
  chainId: number,
  account: `0x${string}`,
  shouldRefresh: boolean,
  ethPrice: number,
  usdcPrice: number
): Promise<{
  openPositions: Position[];
  orders: Order[];
  closedPositions: ClosedPosition[];
}> => {
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
  const chainName = getNameFromChainId(chainId);

  try {
    const response = await fetch(
      `${BACKEND_URL}/data/positions?chain=${chainName}&user=${account}&refresh=${shouldRefresh}`,
      { method: "GET" }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from subgraph: ${response.statusText}`
      );
    }

    const subgraphData = await response.json();

    const [openPositions, orders, closedPositions] = await Promise.all([
      processOpenPositions(chainId, subgraphData.positions),
      processOrders(chainId, subgraphData.orders),
      processClosedPositions(subgraphData.closedPositions, ethPrice, usdcPrice),
    ]);

    return { openPositions, orders, closedPositions };
  } catch (err) {
    console.error(
      `Error in getAllPositions for chain: ${chainId}, account: ${account}`,
      err
    );
    throw new Error("Failed to fetch all positions");
  }
};

const processOpenPositions = async (
  chainId: number,
  positions: any[]
): Promise<Position[]> => {
  return Promise.all(
    positions.map(async (subgraphPosition) => {
      const positionData = await getPosition(
        chainId,
        subgraphPosition.marketId,
        subgraphPosition.positionKey
      );

      const contractedCollateral = contractDecimals(
        positionData.collateral,
        30
      );
      const contractedSize = contractDecimals(positionData.size, 30);
      const entryPriceUsd = contractDecimals(
        positionData.weightedAvgEntryPrice,
        30
      );

      const liqPrice = estimateLiquidationPrice({
        entryPrice: entryPriceUsd,
        collateralUsd: contractedCollateral,
        sizeUsd: contractedSize,
        isLong: positionData.isLong,
      });

      return {
        symbol: positionData.ticker,
        isLong: positionData.isLong,
        size: contractedSize,
        collateral: contractedCollateral,
        entryPrice: entryPriceUsd,
        entryTime: formatUnixTimestamp(subgraphPosition.entryTimestamp),
        liqPrice: liqPrice,
        adlEvents: subgraphPosition.adlEvents.map((event: any) => ({
          sizeDelta: contractDecimals(event.sizeDelta, 30),
          time: formatUnixTimestamp(event.timestamp),
        })),
        marketId: subgraphPosition.marketId,
        positionKey: subgraphPosition.positionKey,
      };
    })
  );
};

const processOrders = async (
  chainId: number,
  orders: any[]
): Promise<Order[]> => {
  return Promise.all(
    orders.map(async (subgraphOrder) => {
      const orderData = await getOrder(
        chainId,
        subgraphOrder.marketId,
        subgraphOrder.orderKey
      );

      return {
        symbol: orderData.input.ticker,
        isLong: orderData.input.isLong,
        orderType: getOrderType(orderData.requestType),
        size: contractDecimals(orderData.input.sizeDelta, 30),
        collateralDelta: Number(orderData.input.collateralDelta),
        triggerPrice: contractDecimals(orderData.input.limitPrice, 30),
        triggerAbove: orderData.input.triggerAbove,
        timeCreated: formatUnixTimestamp(orderData.requestTimestamp),
        marketId: subgraphOrder.marketId,
        orderKey: subgraphOrder.orderKey,
      };
    })
  );
};

const processClosedPositions = async (
  closedPositions: any[],
  ethPrice: number,
  usdcPrice: number
): Promise<ClosedPosition[]> => {
  return Promise.all(
    closedPositions.map((position) => {
      const realizedPnl = calculateRealizedPnl(
        position.avgEntryPrice,
        position.exitPrice,
        position.size,
        position.isLong
      );

      let collateral: number;

      if (position.status === "Liquidated") {
        if (position.isLong) {
          // Collateral is in ETH, convert to USD
          collateral = contractDecimals(position.collateral, 18) * ethPrice;
        } else {
          // Collateral is in USDC, convert to USD (assuming 1 USDC = 1 USD)
          collateral = contractDecimals(position.collateral, 6) * usdcPrice;
        }
      } else {
        // Collateral is already in USD
        collateral = contractDecimals(position.collateral, 30);
      }

      const pnlPercentage = (realizedPnl / collateral) * 100;

      return {
        symbol: position.ticker,
        isLong: position.isLong,
        size: contractDecimals(position.size, 30),
        collateral: collateral,
        entryTime: formatUnixTimestamp(position.entryTimestamp),
        entryPrice: contractDecimals(position.avgEntryPrice, 30),
        exitPrice: contractDecimals(position.exitPrice, 30),
        exitStatus: position.status,
        realizedPnl: realizedPnl,
        pnlPercentage: pnlPercentage,
        marketId: position.marketId,
      };
    })
  );
};

const getOrderType = (requestType: number): string => {
  const orderTypes = [
    "Buy Limit",
    "Sell Limit",
    "Buy Limit",
    "Stop Loss",
    "Take Profit",
  ];
  return orderTypes[requestType] || "Unknown";
};
