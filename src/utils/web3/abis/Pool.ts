export const PoolABI = [
  {
    type: "function",
    name: "createRequest",
    inputs: [
      { name: "_owner", type: "address", internalType: "address" },
      {
        name: "_transferToken",
        type: "address",
        internalType: "address",
      },
      { name: "_amountIn", type: "uint256", internalType: "uint256" },
      {
        name: "_executionFee",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_priceRequestKey",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "_pnlRequestKey",
        type: "bytes32",
        internalType: "bytes32",
      },
      { name: "_weth", type: "address", internalType: "address" },
      {
        name: "_stakeDuration",
        type: "uint40",
        internalType: "uint40",
      },
      { name: "_reverseWrap", type: "bool", internalType: "bool" },
      { name: "_isDeposit", type: "bool", internalType: "bool" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Pool.Input",
        components: [
          {
            name: "amountIn",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "executionFee",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "owner", type: "address", internalType: "address" },
          {
            name: "requestTimestamp",
            type: "uint48",
            internalType: "uint48",
          },
          {
            name: "stakeDuration",
            type: "uint40",
            internalType: "uint40",
          },
          { name: "isLongToken", type: "bool", internalType: "bool" },
          { name: "reverseWrap", type: "bool", internalType: "bool" },
          { name: "isDeposit", type: "bool", internalType: "bool" },
          { name: "key", type: "bytes32", internalType: "bytes32" },
          {
            name: "priceRequestKey",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "pnlRequestKey",
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
    name: "validateConfig",
    inputs: [
      {
        name: "_config",
        type: "tuple",
        internalType: "struct Pool.Config",
        components: [
          { name: "maxLeverage", type: "uint8", internalType: "uint8" },
          {
            name: "maintenanceMargin",
            type: "uint16",
            internalType: "uint16",
          },
          {
            name: "reserveFactor",
            type: "uint16",
            internalType: "uint16",
          },
          {
            name: "maxFundingVelocity",
            type: "int16",
            internalType: "int16",
          },
          { name: "skewScale", type: "int48", internalType: "int48" },
          {
            name: "positiveLiquidityScalar",
            type: "int16",
            internalType: "int16",
          },
          {
            name: "negativeLiquidityScalar",
            type: "int16",
            internalType: "int16",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "pure",
  },
  {
    type: "event",
    name: "MarketStateUpdated",
    inputs: [
      {
        name: "ticker",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "isLong",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
    ],
    anonymous: false,
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
  { type: "error", name: "Pool_InvalidLeverage", inputs: [] },
  { type: "error", name: "Pool_InvalidLiquidityScalar", inputs: [] },
  { type: "error", name: "Pool_InvalidMaintenanceMargin", inputs: [] },
  { type: "error", name: "Pool_InvalidMaxVelocity", inputs: [] },
  { type: "error", name: "Pool_InvalidReserveFactor", inputs: [] },
  { type: "error", name: "Pool_InvalidSkewScalar", inputs: [] },
  { type: "error", name: "Pool_InvalidSkewScale", inputs: [] },
  { type: "error", name: "Pool_InvalidTicker", inputs: [] },
  { type: "error", name: "Pool_InvalidUpdate", inputs: [] },
] as const;
