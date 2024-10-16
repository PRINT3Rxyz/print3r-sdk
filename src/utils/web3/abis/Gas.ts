export const GasABI = [
  {
    type: "function",
    name: "getExecutionFees",
    inputs: [
      { name: "_priceFeed", type: "address", internalType: "address" },
      {
        name: "_positionManager",
        type: "address",
        internalType: "address",
      },
      { name: "_action", type: "uint8", internalType: "uint8" },
      { name: "_hasPnlRequest", type: "bool", internalType: "bool" },
      { name: "_isLimit", type: "bool", internalType: "bool" },
    ],
    outputs: [
      {
        name: "estimatedCost",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "priceUpdateCost",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "error",
    name: "Gas_InsufficientExecutionFee",
    inputs: [
      {
        name: "executionFee",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "minExecutionFee",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "Gas_InsufficientMsgValue",
    inputs: [
      { name: "valueSent", type: "uint256", internalType: "uint256" },
      { name: "executionFee", type: "uint256", internalType: "uint256" },
    ],
  },
  { type: "error", name: "Gas_InvalidActionType", inputs: [] },
] as const;
