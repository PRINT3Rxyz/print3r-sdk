export const MarketFactoryABI = [
  {
    type: "constructor",
    inputs: [
      { name: "_weth", type: "address", internalType: "address" },
      { name: "_usdc", type: "address", internalType: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "cancelCreationRequest",
    inputs: [{ name: "_requestKey", type: "bytes32", internalType: "bytes32" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "cancelOwnershipHandover",
    inputs: [],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "completeOwnershipHandover",
    inputs: [
      { name: "pendingOwner", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "createNewMarket",
    inputs: [
      {
        name: "_input",
        type: "tuple",
        internalType: "struct IMarketFactory.Input",
        components: [
          {
            name: "indexTokenTicker",
            type: "string",
            internalType: "string",
          },
          {
            name: "marketTokenName",
            type: "string",
            internalType: "string",
          },
          {
            name: "marketTokenSymbol",
            type: "string",
            internalType: "string",
          },
          {
            name: "strategy",
            type: "tuple",
            internalType: "struct IPriceFeed.SecondaryStrategy",
            components: [
              { name: "exists", type: "bool", internalType: "bool" },
              {
                name: "feedType",
                type: "uint8",
                internalType: "enum IPriceFeed.FeedType",
              },
              {
                name: "feedAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "feedId",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
        ],
      },
    ],
    outputs: [{ name: "requestKey", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "cumulativeMarketIndex",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "defaultConfig",
    inputs: [],
    outputs: [
      { name: "reserveFactor", type: "uint16", internalType: "uint16" },
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
    stateMutability: "view",
  },
  {
    type: "function",
    name: "defaultTransferGasLimit",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "executeMarketRequest",
    inputs: [{ name: "_requestKey", type: "bytes32", internalType: "bytes32" }],
    outputs: [{ name: "id", type: "bytes32", internalType: "MarketId" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "feeReceiver",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAllMarkets",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct IMarketFactory.CreatedMarket[]",
        components: [
          { name: "id", type: "bytes32", internalType: "MarketId" },
          { name: "ticker", type: "string", internalType: "string" },
          { name: "vault", type: "address", internalType: "address" },
          {
            name: "rewardTracker",
            type: "address",
            internalType: "address",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMarketForTicker",
    inputs: [{ name: "_ticker", type: "string", internalType: "string" }],
    outputs: [{ name: "", type: "bytes32", internalType: "MarketId" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMarketIds",
    inputs: [],
    outputs: [{ name: "", type: "bytes32[]", internalType: "bytes32[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMarketsForUser",
    inputs: [{ name: "_user", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bytes32[]", internalType: "MarketId[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRequest",
    inputs: [{ name: "_requestKey", type: "bytes32", internalType: "bytes32" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct IMarketFactory.Request",
        components: [
          {
            name: "input",
            type: "tuple",
            internalType: "struct IMarketFactory.Input",
            components: [
              {
                name: "indexTokenTicker",
                type: "string",
                internalType: "string",
              },
              {
                name: "marketTokenName",
                type: "string",
                internalType: "string",
              },
              {
                name: "marketTokenSymbol",
                type: "string",
                internalType: "string",
              },
              {
                name: "strategy",
                type: "tuple",
                internalType: "struct IPriceFeed.SecondaryStrategy",
                components: [
                  {
                    name: "exists",
                    type: "bool",
                    internalType: "bool",
                  },
                  {
                    name: "feedType",
                    type: "uint8",
                    internalType: "enum IPriceFeed.FeedType",
                  },
                  {
                    name: "feedAddress",
                    type: "address",
                    internalType: "address",
                  },
                  {
                    name: "feedId",
                    type: "bytes32",
                    internalType: "bytes32",
                  },
                ],
              },
            ],
          },
          {
            name: "requestTimestamp",
            type: "uint48",
            internalType: "uint48",
          },
          {
            name: "requester",
            type: "address",
            internalType: "address",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRequestKeys",
    inputs: [],
    outputs: [{ name: "", type: "bytes32[]", internalType: "bytes32[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "grantRoles",
    inputs: [
      { name: "user", type: "address", internalType: "address" },
      { name: "roles", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "hasAllRoles",
    inputs: [
      { name: "user", type: "address", internalType: "address" },
      { name: "roles", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasAnyRole",
    inputs: [
      { name: "user", type: "address", internalType: "address" },
      { name: "roles", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initialize",
    inputs: [
      {
        name: "_defaultConfig",
        type: "tuple",
        internalType: "struct Pool.Config",
        components: [
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
      { name: "_market", type: "address", internalType: "address" },
      {
        name: "_tradeStorage",
        type: "address",
        internalType: "address",
      },
      {
        name: "_tradeEngine",
        type: "address",
        internalType: "address",
      },
      { name: "_priceFeed", type: "address", internalType: "address" },
      {
        name: "_referralStorage",
        type: "address",
        internalType: "address",
      },
      {
        name: "_positionManager",
        type: "address",
        internalType: "address",
      },
      {
        name: "_feeDistributor",
        type: "address",
        internalType: "address",
      },
      {
        name: "_feeReceiver",
        type: "address",
        internalType: "address",
      },
      {
        name: "_marketCreationFee",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_marketExecutionFee",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_defaultTransferGasLimit",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isMarket",
    inputs: [{ name: "market", type: "bytes32", internalType: "MarketId" }],
    outputs: [{ name: "isMarket", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "marketCreationFee",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "marketExecutionFee",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "markets",
    inputs: [{ name: "index", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "market", type: "bytes32", internalType: "MarketId" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "result", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "ownershipHandoverExpiresAt",
    inputs: [
      { name: "pendingOwner", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "result", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "priceSupportFee",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "renounceRoles",
    inputs: [{ name: "roles", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "requestAssetPricing",
    inputs: [
      {
        name: "_input",
        type: "tuple",
        internalType: "struct IMarketFactory.Input",
        components: [
          {
            name: "indexTokenTicker",
            type: "string",
            internalType: "string",
          },
          {
            name: "marketTokenName",
            type: "string",
            internalType: "string",
          },
          {
            name: "marketTokenSymbol",
            type: "string",
            internalType: "string",
          },
          {
            name: "strategy",
            type: "tuple",
            internalType: "struct IPriceFeed.SecondaryStrategy",
            components: [
              { name: "exists", type: "bool", internalType: "bool" },
              {
                name: "feedType",
                type: "uint8",
                internalType: "enum IPriceFeed.FeedType",
              },
              {
                name: "feedAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "feedId",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "requestOwnershipHandover",
    inputs: [],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "revokeRoles",
    inputs: [
      { name: "user", type: "address", internalType: "address" },
      { name: "roles", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "rolesOf",
    inputs: [{ name: "user", type: "address", internalType: "address" }],
    outputs: [{ name: "roles", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setDefaultConfig",
    inputs: [
      {
        name: "_defaultConfig",
        type: "tuple",
        internalType: "struct Pool.Config",
        components: [
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
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setFeedValidators",
    inputs: [{ name: "_pyth", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setRouter",
    inputs: [{ name: "_router", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "supportAsset",
    inputs: [
      {
        name: "_assetRequestKey",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "updateFeeDistributor",
    inputs: [
      {
        name: "_feeDistributor",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateMarketFees",
    inputs: [
      {
        name: "_marketCreationFee",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_marketExecutionFee",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_priceSupportFee",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updatePositionManager",
    inputs: [
      {
        name: "_positionManager",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updatePriceFeed",
    inputs: [
      {
        name: "_priceFeed",
        type: "address",
        internalType: "contract IPriceFeed",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateTradeEngine",
    inputs: [
      { name: "_tradeEngine", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateTransferGasLimit",
    inputs: [
      {
        name: "_defaultTransferGasLimit",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdrawCreationTaxes",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "AssetRequested",
    inputs: [
      {
        name: "ticker",
        type: "string",
        indexed: false,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DefaultConfigSet",
    inputs: [],
    anonymous: false,
  },
  {
    type: "event",
    name: "HoldingTokens",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "token",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MarketCreated",
    inputs: [
      {
        name: "id",
        type: "bytes32",
        indexed: false,
        internalType: "MarketId",
      },
      {
        name: "ticker",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "vault",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "rewardTracker",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MarketFactoryInitialized",
    inputs: [
      {
        name: "priceStorage",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MarketRequestCancelled",
    inputs: [
      {
        name: "requestKey",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "requester",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "refundAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MarketRequested",
    inputs: [
      {
        name: "requestKey",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "indexTokenTicker",
        type: "string",
        indexed: false,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipHandoverCanceled",
    inputs: [
      {
        name: "pendingOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipHandoverRequested",
    inputs: [
      {
        name: "pendingOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "oldOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RolesUpdated",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "roles",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "AlreadyInitialized", inputs: [] },
  {
    type: "error",
    name: "EnumerableMapNonexistentKey",
    inputs: [{ name: "key", type: "bytes32", internalType: "bytes32" }],
  },
  {
    type: "error",
    name: "MarketFactory_AlreadyInitialized",
    inputs: [],
  },
  {
    type: "error",
    name: "MarketFactory_FailedToAddMarket",
    inputs: [],
  },
  {
    type: "error",
    name: "MarketFactory_FailedToAddRequest",
    inputs: [],
  },
  {
    type: "error",
    name: "MarketFactory_FailedToRemoveRequest",
    inputs: [],
  },
  {
    type: "error",
    name: "MarketFactory_InsufficientBalance",
    inputs: [],
  },
  { type: "error", name: "MarketFactory_InvalidDecimals", inputs: [] },
  { type: "error", name: "MarketFactory_InvalidFee", inputs: [] },
  { type: "error", name: "MarketFactory_InvalidLeverage", inputs: [] },
  { type: "error", name: "MarketFactory_InvalidOwner", inputs: [] },
  {
    type: "error",
    name: "MarketFactory_InvalidSecondaryStrategy",
    inputs: [],
  },
  { type: "error", name: "MarketFactory_InvalidTicker", inputs: [] },
  { type: "error", name: "MarketFactory_InvalidTimestamp", inputs: [] },
  {
    type: "error",
    name: "MarketFactory_MarketAlreadyExists",
    inputs: [],
  },
  { type: "error", name: "MarketFactory_MarketExists", inputs: [] },
  {
    type: "error",
    name: "MarketFactory_RequestDoesNotExist",
    inputs: [],
  },
  { type: "error", name: "MarketFactory_RequestExists", inputs: [] },
  {
    type: "error",
    name: "MarketFactory_RequestNotCancellable",
    inputs: [],
  },
  { type: "error", name: "MarketFactory_SelfExecution", inputs: [] },
  { type: "error", name: "NewOwnerIsZeroAddress", inputs: [] },
  { type: "error", name: "NoHandoverRequest", inputs: [] },
  { type: "error", name: "Oracle_InvalidPoolType", inputs: [] },
  {
    type: "error",
    name: "Oracle_InvalidSecondaryStrategy",
    inputs: [],
  },
  { type: "error", name: "Reentrancy", inputs: [] },
  { type: "error", name: "Unauthorized", inputs: [] },
] as const;
