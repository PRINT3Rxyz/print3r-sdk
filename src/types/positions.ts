// Types need to be converted from their UNIX versions into locale strings.

export interface Position {
  id?: string;
  isPending?: boolean;
  isDecreasing?: boolean;
  symbol: string;
  isLong: boolean;
  size: number;
  collateral: number;
  entryPrice: number;
  entryTime: string;
  liqPrice: number;
  adlEvents: AdlEvent[];
  marketId: `0x${string}`;
  positionKey: `0x${string}`;
}

export interface AdlEvent {
  sizeDelta: number;
  time: string;
}

export interface Order {
  symbol: string;
  isLong: boolean;
  orderType: string;
  size: number;
  collateralDelta: number; // in tokens
  triggerPrice: number;
  triggerAbove: boolean;
  timeCreated: string;
  marketId: `0x${string}`;
  orderKey: `0x${string}`;
}

export interface ClosedPosition {
  symbol: string;
  isLong: boolean;
  size: number;
  collateral: number;
  entryTime: string;
  entryPrice: number;
  exitPrice: number;
  exitStatus: string; // Closed or Liquidated
  realizedPnl: number;
  pnlPercentage: number;
  marketId: `0x${string}`;
}
