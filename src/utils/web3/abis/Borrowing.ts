export const BorrowingABI = [
  {
    type: "function",
    name: "calculateFeesSinceUpdate",
    inputs: [
      { name: "_rate", type: "uint256", internalType: "uint256" },
      { name: "_lastUpdate", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "fee", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "calculatePendingFees",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_market", type: "address", internalType: "address" },
      { name: "_isLong", type: "bool", internalType: "bool" },
    ],
    outputs: [
      { name: "pendingFees", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "calculateRate",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_market", type: "address", internalType: "address" },
      { name: "_vault", type: "address", internalType: "address" },
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
        name: "borrowRatePerDay",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTotalFeesOwedForAsset",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_market", type: "address", internalType: "address" },
      { name: "_isLong", type: "bool", internalType: "bool" },
    ],
    outputs: [
      {
        name: "totalFeesOwedUsd",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
] as const;
