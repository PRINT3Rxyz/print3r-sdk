export const ExecutionABI = [
  {
    type: "function",
    name: "checkIsLiquidatable",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      {
        name: "market",
        type: "address",
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
    outputs: [{ name: "isLiquidatable", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "checkIsLiquidatableWithPriceImpact",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      {
        name: "market",
        type: "address",
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
    outputs: [{ name: "isLiquidatable", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTokenPrices",
    inputs: [
      {
        name: "priceFeed",
        type: "IPriceFeed",
        internalType: "contract IPriceFeed",
      },
      { name: "_indexTicker", type: "string", internalType: "string" },
      {
        name: "_requestTimestamp",
        type: "uint48",
        internalType: "uint48",
      },
      { name: "_isLong", type: "bool", internalType: "bool" },
      { name: "_isIncrease", type: "bool", internalType: "bool" },
    ],
    outputs: [
      {
        name: "prices",
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
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initiate",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      {
        name: "market",
        type: "address",
        internalType: "contract IMarket",
      },
      {
        name: "vault",
        type: "address",
        internalType: "contract IVault",
      },
      {
        name: "priceFeed",
        type: "IPriceFeed",
        internalType: "contract IPriceFeed",
      },
      { name: "_orderKey", type: "bytes32", internalType: "bytes32" },
      { name: "_requestKey", type: "bytes32", internalType: "bytes32" },
      { name: "_feeReceiver", type: "address", internalType: "address" },
    ],
    outputs: [
      {
        name: "prices",
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
              { name: "isLong", type: "bool", internalType: "bool" },
              { name: "isLimit", type: "bool", internalType: "bool" },
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
          { name: "user", type: "address", internalType: "address" },
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
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initiateAdlOrder",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      {
        name: "market",
        type: "address",
        internalType: "contract IMarket",
      },
      {
        name: "vault",
        type: "address",
        internalType: "contract IVault",
      },
      {
        name: "priceFeed",
        type: "IPriceFeed",
        internalType: "contract IPriceFeed",
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
        name: "_requestTimestamp",
        type: "uint48",
        internalType: "uint48",
      },
      { name: "_feeReceiver", type: "address", internalType: "address" },
    ],
    outputs: [
      {
        name: "prices",
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
      {
        name: "params",
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
      {
        name: "startingPnlFactor",
        type: "int256",
        internalType: "int256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "validateAdl",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      {
        name: "market",
        type: "address",
        internalType: "contract IMarket",
      },
      {
        name: "vault",
        type: "address",
        internalType: "contract IVault",
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
      {
        name: "_startingPnlFactor",
        type: "int256",
        internalType: "int256",
      },
      { name: "_isLong", type: "bool", internalType: "bool" },
    ],
    outputs: [],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "validatePriceRequest",
    inputs: [
      {
        name: "priceFeed",
        type: "IPriceFeed",
        internalType: "contract IPriceFeed",
      },
      { name: "_caller", type: "address", internalType: "address" },
      { name: "_requestKey", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [],
    stateMutability: "view",
  },
  { type: "error", name: "Execution_AccessDenied", inputs: [] },
  { type: "error", name: "Execution_FeesExceedCollateral", inputs: [] },
  {
    type: "error",
    name: "Execution_FeesExceedCollateralDelta",
    inputs: [],
  },
  { type: "error", name: "Execution_InvalidExecutor", inputs: [] },
  { type: "error", name: "Execution_InvalidOrderKey", inputs: [] },
  { type: "error", name: "Execution_InvalidPosition", inputs: [] },
  {
    type: "error",
    name: "Execution_LimitPriceNotMet",
    inputs: [
      { name: "limitPrice", type: "uint256", internalType: "uint256" },
      { name: "markPrice", type: "uint256", internalType: "uint256" },
    ],
  },
  { type: "error", name: "Execution_LiquidatablePosition", inputs: [] },
  {
    type: "error",
    name: "Execution_MinCollateralThreshold",
    inputs: [],
  },
  { type: "error", name: "Execution_PNLFactorNotReduced", inputs: [] },
  {
    type: "error",
    name: "Execution_PnlToPoolRatioNotExceeded",
    inputs: [
      { name: "pnlFactor", type: "int256", internalType: "int256" },
      { name: "maxPnlFactor", type: "uint256", internalType: "uint256" },
    ],
  },
  { type: "error", name: "Execution_PositionExists", inputs: [] },
  {
    type: "error",
    name: "Execution_PositionNotProfitable",
    inputs: [],
  },
  { type: "error", name: "Execution_ZeroFees", inputs: [] },
  { type: "error", name: "MarketUtils_MaxOiExceeded", inputs: [] },
  { type: "error", name: "MathUtils_InputTooSmall", inputs: [] },
  {
    type: "error",
    name: "MathUtils_IntOverflow",
    inputs: [
      { name: "x", type: "int256", internalType: "int256" },
      { name: "y", type: "int256", internalType: "int256" },
    ],
  },
  { type: "error", name: "Oracle_FailedToGetDecimals", inputs: [] },
] as const;
