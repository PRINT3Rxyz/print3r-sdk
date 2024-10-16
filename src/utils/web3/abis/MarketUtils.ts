export const MarketUtilsABI = [
  {
    type: "function",
    name: "FEE_SCALE",
    inputs: [],
    outputs: [{ name: "", type: "uint64", internalType: "uint64" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MAX_ALLOCATION",
    inputs: [],
    outputs: [{ name: "", type: "uint8", internalType: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "calculateMintAmount",
    inputs: [
      { name: "_vault", type: "address", internalType: "address" },
      {
        name: "_longPrices",
        type: "tuple",
        internalType: "struct Oracle.Prices",
        components: [
          { name: "min", type: "uint256", internalType: "uint256" },
          { name: "med", type: "uint256", internalType: "uint256" },
          { name: "max", type: "uint256", internalType: "uint256" },
        ],
      },
      {
        name: "_shortPrices",
        type: "tuple",
        internalType: "struct Oracle.Prices",
        components: [
          { name: "min", type: "uint256", internalType: "uint256" },
          { name: "med", type: "uint256", internalType: "uint256" },
          { name: "max", type: "uint256", internalType: "uint256" },
        ],
      },
      { name: "_amountIn", type: "uint256", internalType: "uint256" },
      {
        name: "_longBorrowFeesUsd",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_shortBorrowFeesUsd",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_cumulativePnl",
        type: "int256",
        internalType: "int256",
      },
      { name: "_isLongToken", type: "bool", internalType: "bool" },
    ],
    outputs: [
      {
        name: "marketTokenAmount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "calculateWithdrawalAmount",
    inputs: [
      { name: "_vault", type: "address", internalType: "address" },
      {
        name: "_longPrices",
        type: "tuple",
        internalType: "struct Oracle.Prices",
        components: [
          { name: "min", type: "uint256", internalType: "uint256" },
          { name: "med", type: "uint256", internalType: "uint256" },
          { name: "max", type: "uint256", internalType: "uint256" },
        ],
      },
      {
        name: "_shortPrices",
        type: "tuple",
        internalType: "struct Oracle.Prices",
        components: [
          { name: "min", type: "uint256", internalType: "uint256" },
          { name: "med", type: "uint256", internalType: "uint256" },
          { name: "max", type: "uint256", internalType: "uint256" },
        ],
      },
      {
        name: "_marketTokenAmountIn",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_longBorrowFeesUsd",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_shortBorrowFeesUsd",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_cumulativePnl",
        type: "int256",
        internalType: "int256",
      },
      { name: "_isLongToken", type: "bool", internalType: "bool" },
    ],
    outputs: [
      { name: "tokenAmount", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "encodeAllocations",
    inputs: [{ name: "_allocs", type: "uint8[]", internalType: "uint8[]" }],
    outputs: [{ name: "allocations", type: "bytes", internalType: "bytes" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "getAum",
    inputs: [
      { name: "_vault", type: "address", internalType: "address" },
      {
        name: "_longTokenPrice",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_longBorrowFeesUsd",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_shortTokenPrice",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_shortBorrowFeesUsd",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "_cumulativePnl", type: "int256", internalType: "int256" },
    ],
    outputs: [{ name: "aum", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAvailableOiUsd",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_market", type: "address", internalType: "address" },
      { name: "_vault", type: "address", internalType: "address" },
      { name: "_indexPrice", type: "uint256", internalType: "uint256" },
      {
        name: "_collateralTokenPrice",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "_isLong", type: "bool", internalType: "bool" },
    ],
    outputs: [
      { name: "availableOi", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCumulativeMarketPnl",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_market", type: "address", internalType: "address" },
      { name: "_indexPrice", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "int256", internalType: "int256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMarketPnl",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_market", type: "address", internalType: "address" },
      { name: "_indexPrice", type: "uint256", internalType: "uint256" },
      { name: "_isLong", type: "bool", internalType: "bool" },
    ],
    outputs: [{ name: "netPnl", type: "int256", internalType: "int256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMarketTokenPrice",
    inputs: [
      { name: "_vault", type: "address", internalType: "address" },
      {
        name: "_longTokenPrice",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_longBorrowFeesUsd",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_shortTokenPrice",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_shortBorrowFeesUsd",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "_cumulativePnl", type: "int256", internalType: "int256" },
    ],
    outputs: [
      { name: "lpTokenPrice", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMaxOpenInterest",
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
        name: "_collateralPrice",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_collateralBaseUnit",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "_isLong", type: "bool", internalType: "bool" },
    ],
    outputs: [
      {
        name: "maxOpenInterest",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPnlFactor",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_market", type: "address", internalType: "address" },
      { name: "_vault", type: "address", internalType: "address" },
      { name: "_indexPrice", type: "uint256", internalType: "uint256" },
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
      { name: "_isLong", type: "bool", internalType: "bool" },
    ],
    outputs: [{ name: "pnlFactor", type: "int256", internalType: "int256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPoolBalanceUsd",
    inputs: [
      {
        name: "vault",
        type: "IVault",
        internalType: "contract IVault",
      },
      {
        name: "_collateralTokenPrice",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_collateralBaseUnit",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "_isLong", type: "bool", internalType: "bool" },
    ],
    outputs: [{ name: "poolUsd", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  { type: "error", name: "MarketUtils_AdlCantOccur", inputs: [] },
  { type: "error", name: "MarketUtils_AmountTooSmall", inputs: [] },
  {
    type: "error",
    name: "MarketUtils_InsufficientFreeLiquidity",
    inputs: [],
  },
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
] as const;
