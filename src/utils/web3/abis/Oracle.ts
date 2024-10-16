export const OracleABI = [
  {
    type: "function",
    name: "encodePnl",
    inputs: [
      { name: "_precision", type: "uint8", internalType: "uint8" },
      { name: "_timestamp", type: "uint48", internalType: "uint48" },
      { name: "_cumulativePnl", type: "int128", internalType: "int128" },
    ],
    outputs: [{ name: "", type: "bytes", internalType: "bytes" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "encodePrices",
    inputs: [
      { name: "_tickers", type: "string[]", internalType: "string[]" },
      { name: "_precisions", type: "uint8[]", internalType: "uint8[]" },
      {
        name: "_variances",
        type: "uint16[]",
        internalType: "uint16[]",
      },
      {
        name: "_timestamps",
        type: "uint48[]",
        internalType: "uint48[]",
      },
      { name: "_meds", type: "uint64[]", internalType: "uint64[]" },
    ],
    outputs: [{ name: "", type: "bytes", internalType: "bytes" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "estimateRequestCost",
    inputs: [{ name: "_priceFeed", type: "address", internalType: "address" }],
    outputs: [{ name: "cost", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMaxPrice",
    inputs: [
      {
        name: "priceFeed",
        type: "IPriceFeed",
        internalType: "contract IPriceFeed",
      },
      { name: "_ticker", type: "string", internalType: "string" },
      {
        name: "_blockTimestamp",
        type: "uint48",
        internalType: "uint48",
      },
    ],
    outputs: [{ name: "maxPrice", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMinPrice",
    inputs: [
      {
        name: "priceFeed",
        type: "IPriceFeed",
        internalType: "contract IPriceFeed",
      },
      { name: "_ticker", type: "string", internalType: "string" },
      {
        name: "_blockTimestamp",
        type: "uint48",
        internalType: "uint48",
      },
    ],
    outputs: [{ name: "minPrice", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPrice",
    inputs: [
      {
        name: "priceFeed",
        type: "IPriceFeed",
        internalType: "contract IPriceFeed",
      },
      { name: "_ticker", type: "string", internalType: "string" },
      {
        name: "_blockTimestamp",
        type: "uint48",
        internalType: "uint48",
      },
    ],
    outputs: [{ name: "medPrice", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getVaultPrices",
    inputs: [
      {
        name: "priceFeed",
        type: "IPriceFeed",
        internalType: "contract IPriceFeed",
      },
      {
        name: "_blockTimestamp",
        type: "uint48",
        internalType: "uint48",
      },
    ],
    outputs: [
      {
        name: "longPrices",
        type: "tuple",
        internalType: "struct Oracle.Prices",
        components: [
          { name: "min", type: "uint256", internalType: "uint256" },
          { name: "med", type: "uint256", internalType: "uint256" },
          { name: "max", type: "uint256", internalType: "uint256" },
        ],
      },
      {
        name: "shortPrices",
        type: "tuple",
        internalType: "struct Oracle.Prices",
        components: [
          { name: "min", type: "uint256", internalType: "uint256" },
          { name: "med", type: "uint256", internalType: "uint256" },
          { name: "max", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getVaultPricesForSide",
    inputs: [
      {
        name: "priceFeed",
        type: "IPriceFeed",
        internalType: "contract IPriceFeed",
      },
      {
        name: "_blockTimestamp",
        type: "uint48",
        internalType: "uint48",
      },
      { name: "_isLong", type: "bool", internalType: "bool" },
    ],
    outputs: [
      {
        name: "prices",
        type: "tuple",
        internalType: "struct Oracle.Prices",
        components: [
          { name: "min", type: "uint256", internalType: "uint256" },
          { name: "med", type: "uint256", internalType: "uint256" },
          { name: "max", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  { type: "error", name: "Oracle_FailedToGetDecimals", inputs: [] },
  { type: "error", name: "Oracle_InvalidAmmDecimals", inputs: [] },
  { type: "error", name: "Oracle_InvalidPoolType", inputs: [] },
  { type: "error", name: "Oracle_InvalidPriceRetrieval", inputs: [] },
  { type: "error", name: "Oracle_InvalidReferenceQuery", inputs: [] },
  {
    type: "error",
    name: "Oracle_InvalidSecondaryStrategy",
    inputs: [],
  },
  { type: "error", name: "Oracle_RequestExpired", inputs: [] },
  { type: "error", name: "Oracle_SequencerDown", inputs: [] },
] as const;
