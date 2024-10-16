export const PositionABI = [
  {
    type: "function",
    name: "calculateAdlPercentage",
    inputs: [
      {
        name: "_pnlToPoolRatio",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_positionProfit",
        type: "int256",
        internalType: "int256",
      },
      {
        name: "_positionSize",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "adlPercentage",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "createLiquidationOrder",
    inputs: [
      {
        name: "_position",
        type: "tuple",
        internalType: "struct Position.Data",
        components: [
          { name: "ticker", type: "string", internalType: "string" },
          { name: "user", type: "address", internalType: "address" },
          {
            name: "collateralToken",
            type: "address",
            internalType: "address",
          },
          { name: "isLong", type: "bool", internalType: "bool" },
          {
            name: "lastUpdate",
            type: "uint48",
            internalType: "uint48",
          },
          {
            name: "collateral",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "size", type: "uint256", internalType: "uint256" },
          {
            name: "weightedAvgEntryPrice",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "fundingParams",
            type: "tuple",
            internalType: "struct Position.FundingParams",
            components: [
              {
                name: "lastFundingAccrued",
                type: "int256",
                internalType: "int256",
              },
              {
                name: "fundingOwed",
                type: "int256",
                internalType: "int256",
              },
            ],
          },
          {
            name: "borrowingParams",
            type: "tuple",
            internalType: "struct Position.BorrowingParams",
            components: [
              {
                name: "feesOwed",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "lastLongCumulativeBorrowFee",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "lastShortCumulativeBorrowFee",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
          {
            name: "stopLossKey",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "takeProfitKey",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
      },
      {
        name: "_collateralPrice",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_collateralBaseUnit",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "_liquidator", type: "address", internalType: "address" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Position.Settlement",
        components: [
          {
            name: "request",
            type: "tuple",
            internalType: "struct Position.Request",
            components: [
              {
                name: "input",
                type: "tuple",
                internalType: "struct Position.Input",
                components: [
                  {
                    name: "ticker",
                    type: "string",
                    internalType: "string",
                  },
                  {
                    name: "collateralToken",
                    type: "address",
                    internalType: "address",
                  },
                  {
                    name: "collateralDelta",
                    type: "uint256",
                    internalType: "uint256",
                  },
                  {
                    name: "sizeDelta",
                    type: "uint256",
                    internalType: "uint256",
                  },
                  {
                    name: "limitPrice",
                    type: "uint256",
                    internalType: "uint256",
                  },
                  {
                    name: "maxSlippage",
                    type: "uint128",
                    internalType: "uint128",
                  },
                  {
                    name: "executionFee",
                    type: "uint64",
                    internalType: "uint64",
                  },
                  {
                    name: "isLong",
                    type: "bool",
                    internalType: "bool",
                  },
                  {
                    name: "isLimit",
                    type: "bool",
                    internalType: "bool",
                  },
                  {
                    name: "isIncrease",
                    type: "bool",
                    internalType: "bool",
                  },
                  {
                    name: "reverseWrap",
                    type: "bool",
                    internalType: "bool",
                  },
                  {
                    name: "triggerAbove",
                    type: "bool",
                    internalType: "bool",
                  },
                ],
              },
              {
                name: "user",
                type: "address",
                internalType: "address",
              },
              {
                name: "requestTimestamp",
                type: "uint48",
                internalType: "uint48",
              },
              {
                name: "requestType",
                type: "Position.RequestType",
                internalType: "enum Position.RequestType",
              },
              {
                name: "requestKey",
                type: "bytes32",
                internalType: "bytes32",
              },
              {
                name: "stopLossKey",
                type: "bytes32",
                internalType: "bytes32",
              },
              {
                name: "takeProfitKey",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
          {
            name: "orderKey",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "limitRequestKey",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "feeReceiver",
            type: "address",
            internalType: "address",
          },
          { name: "isAdl", type: "bool", internalType: "bool" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getFeesForKey",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      {
        name: "_tradeStorage",
        type: "address",
        internalType: "address",
      },
      { name: "_market", type: "address", internalType: "address" },
      { name: "_positionKey", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [
      { name: "", type: "int256", internalType: "int256" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getLiquidationPrice",
    inputs: [
      {
        name: "_position",
        type: "tuple",
        internalType: "struct Position.Data",
        components: [
          { name: "ticker", type: "string", internalType: "string" },
          { name: "user", type: "address", internalType: "address" },
          {
            name: "collateralToken",
            type: "address",
            internalType: "address",
          },
          { name: "isLong", type: "bool", internalType: "bool" },
          {
            name: "lastUpdate",
            type: "uint48",
            internalType: "uint48",
          },
          {
            name: "collateral",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "size", type: "uint256", internalType: "uint256" },
          {
            name: "weightedAvgEntryPrice",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "fundingParams",
            type: "tuple",
            internalType: "struct Position.FundingParams",
            components: [
              {
                name: "lastFundingAccrued",
                type: "int256",
                internalType: "int256",
              },
              {
                name: "fundingOwed",
                type: "int256",
                internalType: "int256",
              },
            ],
          },
          {
            name: "borrowingParams",
            type: "tuple",
            internalType: "struct Position.BorrowingParams",
            components: [
              {
                name: "feesOwed",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "lastLongCumulativeBorrowFee",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "lastShortCumulativeBorrowFee",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
          {
            name: "stopLossKey",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "takeProfitKey",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
      },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "getNextAdlTarget",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      {
        name: "tradeStorage",
        type: "ITradeStorage",
        internalType: "contract ITradeStorage",
      },
      { name: "_ticker", type: "string", internalType: "string" },
      { name: "_indexPrice", type: "uint256", internalType: "uint256" },
      {
        name: "_indexBaseUnit",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_totalPoolSizeUsd",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "_isLong", type: "bool", internalType: "bool" },
    ],
    outputs: [
      { name: "positionKey", type: "bytes32", internalType: "bytes32" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPositionPnl",
    inputs: [
      {
        name: "_positionSizeUsd",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_weightedAvgEntryPrice",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "_indexPrice", type: "uint256", internalType: "uint256" },
      {
        name: "_indexBaseUnit",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "_isLong", type: "bool", internalType: "bool" },
    ],
    outputs: [{ name: "", type: "int256", internalType: "int256" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "getTotalBorrowFeesUsd",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      {
        name: "market",
        type: "IMarket",
        internalType: "contract IMarket",
      },
      {
        name: "_position",
        type: "tuple",
        internalType: "struct Position.Data",
        components: [
          { name: "ticker", type: "string", internalType: "string" },
          { name: "user", type: "address", internalType: "address" },
          {
            name: "collateralToken",
            type: "address",
            internalType: "address",
          },
          { name: "isLong", type: "bool", internalType: "bool" },
          {
            name: "lastUpdate",
            type: "uint48",
            internalType: "uint48",
          },
          {
            name: "collateral",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "size", type: "uint256", internalType: "uint256" },
          {
            name: "weightedAvgEntryPrice",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "fundingParams",
            type: "tuple",
            internalType: "struct Position.FundingParams",
            components: [
              {
                name: "lastFundingAccrued",
                type: "int256",
                internalType: "int256",
              },
              {
                name: "fundingOwed",
                type: "int256",
                internalType: "int256",
              },
            ],
          },
          {
            name: "borrowingParams",
            type: "tuple",
            internalType: "struct Position.BorrowingParams",
            components: [
              {
                name: "feesOwed",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "lastLongCumulativeBorrowFee",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "lastShortCumulativeBorrowFee",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
          {
            name: "stopLossKey",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "takeProfitKey",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
      },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTotalFeesOwed",
    inputs: [
      { name: "marketId", type: "bytes32", internalType: "MarketId" },
      {
        name: "market",
        type: "IMarket",
        internalType: "contract IMarket",
      },
      {
        name: "_position",
        type: "tuple",
        internalType: "struct Position.Data",
        components: [
          { name: "ticker", type: "string", internalType: "string" },
          { name: "user", type: "address", internalType: "address" },
          {
            name: "collateralToken",
            type: "address",
            internalType: "address",
          },
          { name: "isLong", type: "bool", internalType: "bool" },
          {
            name: "lastUpdate",
            type: "uint48",
            internalType: "uint48",
          },
          {
            name: "collateral",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "size", type: "uint256", internalType: "uint256" },
          {
            name: "weightedAvgEntryPrice",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "fundingParams",
            type: "tuple",
            internalType: "struct Position.FundingParams",
            components: [
              {
                name: "lastFundingAccrued",
                type: "int256",
                internalType: "int256",
              },
              {
                name: "fundingOwed",
                type: "int256",
                internalType: "int256",
              },
            ],
          },
          {
            name: "borrowingParams",
            type: "tuple",
            internalType: "struct Position.BorrowingParams",
            components: [
              {
                name: "feesOwed",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "lastLongCumulativeBorrowFee",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "lastShortCumulativeBorrowFee",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
          {
            name: "stopLossKey",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "takeProfitKey",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
      },
      {
        name: "_prices",
        type: "tuple",
        internalType: "struct Execution.Prices",
        components: [
          {
            name: "indexPrice",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "indexBaseUnit",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "impactedPrice",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "longMarketTokenPrice",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "shortMarketTokenPrice",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "priceImpactUsd",
            type: "int256",
            internalType: "int256",
          },
          {
            name: "collateralPrice",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "collateralBaseUnit",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTotalFeesOwedUsd",
    inputs: [
      { name: "marketId", type: "bytes32", internalType: "MarketId" },
      {
        name: "market",
        type: "IMarket",
        internalType: "contract IMarket",
      },
      {
        name: "_position",
        type: "tuple",
        internalType: "struct Position.Data",
        components: [
          { name: "ticker", type: "string", internalType: "string" },
          { name: "user", type: "address", internalType: "address" },
          {
            name: "collateralToken",
            type: "address",
            internalType: "address",
          },
          { name: "isLong", type: "bool", internalType: "bool" },
          {
            name: "lastUpdate",
            type: "uint48",
            internalType: "uint48",
          },
          {
            name: "collateral",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "size", type: "uint256", internalType: "uint256" },
          {
            name: "weightedAvgEntryPrice",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "fundingParams",
            type: "tuple",
            internalType: "struct Position.FundingParams",
            components: [
              {
                name: "lastFundingAccrued",
                type: "int256",
                internalType: "int256",
              },
              {
                name: "fundingOwed",
                type: "int256",
                internalType: "int256",
              },
            ],
          },
          {
            name: "borrowingParams",
            type: "tuple",
            internalType: "struct Position.BorrowingParams",
            components: [
              {
                name: "feesOwed",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "lastLongCumulativeBorrowFee",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "lastShortCumulativeBorrowFee",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
          {
            name: "stopLossKey",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "takeProfitKey",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
      },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  { type: "error", name: "MathUtils_InputTooSmall", inputs: [] },
  {
    type: "error",
    name: "MathUtils_IntOverflow",
    inputs: [
      { name: "x", type: "int256", internalType: "int256" },
      { name: "y", type: "int256", internalType: "int256" },
    ],
  },
  { type: "error", name: "Position_BelowMinLeverage", inputs: [] },
  { type: "error", name: "Position_CollateralExceedsSize", inputs: [] },
  { type: "error", name: "Position_InvalidAdlFee", inputs: [] },
  {
    type: "error",
    name: "Position_InvalidFeeForExecution",
    inputs: [],
  },
  { type: "error", name: "Position_InvalidSlippage", inputs: [] },
  { type: "error", name: "Position_InvalidTradingFee", inputs: [] },
  { type: "error", name: "Position_OverMaxLeverage", inputs: [] },
] as const;
