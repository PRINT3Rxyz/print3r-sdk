export const FundingABI = [
  {
    type: "function",
    name: "calculateNextFunding",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_market", type: "address", internalType: "address" },
      { name: "_indexPrice", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "", type: "int64", internalType: "int64" },
      { name: "", type: "int256", internalType: "int256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCurrentFundingRate",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_market", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "int64", internalType: "int64" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCurrentVelocity",
    inputs: [
      { name: "_market", type: "address", internalType: "address" },
      { name: "_skew", type: "int256", internalType: "int256" },
      { name: "_maxVelocity", type: "int16", internalType: "int16" },
      { name: "_skewScale", type: "int48", internalType: "int48" },
      {
        name: "_totalOpenInterest",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [{ name: "velocity", type: "int256", internalType: "int256" }],
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
] as const;
