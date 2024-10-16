export const PriceImpactABI = [
  {
    type: "function",
    name: "estimate",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_market", type: "address", internalType: "address" },
      { name: "_vault", type: "address", internalType: "address" },
      { name: "_sizeDeltaUsd", type: "int256", internalType: "int256" },
      { name: "_indexPrice", type: "uint256", internalType: "uint256" },
      {
        name: "_collateralPrice",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "_isLong", type: "bool", internalType: "bool" },
    ],
    outputs: [
      {
        name: "priceImpactUsd",
        type: "int256",
        internalType: "int256",
      },
      {
        name: "impactedPrice",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "execute",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      {
        name: "market",
        type: "IMarket",
        internalType: "contract IMarket",
      },
      {
        name: "vault",
        type: "IVault",
        internalType: "contract IVault",
      },
      {
        name: "_request",
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
    outputs: [
      {
        name: "impactedPrice",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "priceImpactUsd", type: "int256", internalType: "int256" },
    ],
    stateMutability: "view",
  },
  {
    type: "error",
    name: "PriceImpact_InsufficientLiquidity",
    inputs: [],
  },
  { type: "error", name: "PriceImpact_InvalidDecrease", inputs: [] },
  {
    type: "error",
    name: "PriceImpact_InvalidImpactedPrice",
    inputs: [],
  },
  { type: "error", name: "PriceImpact_InvalidState", inputs: [] },
  { type: "error", name: "PriceImpact_SizeDeltaIsZero", inputs: [] },
  { type: "error", name: "PriceImpact_SlippageExceedsMax", inputs: [] },
] as const;
