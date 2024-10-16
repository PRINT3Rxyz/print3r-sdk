export const IMarketABI = [
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
    name: "FUNDING_VELOCITY_CLAMP",
    inputs: [],
    outputs: [{ name: "", type: "uint64", internalType: "uint64" }],
    stateMutability: "view",
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
    name: "cancelRequest",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_requestKey", type: "bytes32", internalType: "bytes32" },
      { name: "_caller", type: "address", internalType: "address" },
    ],
    outputs: [
      { name: "tokenOut", type: "address", internalType: "address" },
      { name: "amountOut", type: "uint256", internalType: "uint256" },
      { name: "shouldUnwrap", type: "bool", internalType: "bool" },
    ],
    stateMutability: "nonpayable",
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
    name: "createRequest",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
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
        name: "_stakeDuration",
        type: "uint40",
        internalType: "uint40",
      },
      { name: "_reverseWrap", type: "bool", internalType: "bool" },
      { name: "_isDeposit", type: "bool", internalType: "bool" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "executeDeposit",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      {
        name: "_params",
        type: "tuple",
        internalType: "struct IVault.ExecuteDeposit",
        components: [
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
            name: "deposit",
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
              {
                name: "owner",
                type: "address",
                internalType: "address",
              },
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
              {
                name: "isLongToken",
                type: "bool",
                internalType: "bool",
              },
              {
                name: "reverseWrap",
                type: "bool",
                internalType: "bool",
              },
              { name: "isDeposit", type: "bool", internalType: "bool" },
              { name: "key", type: "bytes32", internalType: "bytes32" },
              {
                name: "priceRequestKey",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
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
          { name: "key", type: "bytes32", internalType: "bytes32" },
          {
            name: "longBorrowFeesUsd",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "shortBorrowFeesUsd",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "cumulativePnl",
            type: "int256",
            internalType: "int256",
          },
        ],
      },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "executeWithdrawal",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      {
        name: "_params",
        type: "tuple",
        internalType: "struct IVault.ExecuteWithdrawal",
        components: [
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
            name: "withdrawal",
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
              {
                name: "owner",
                type: "address",
                internalType: "address",
              },
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
              {
                name: "isLongToken",
                type: "bool",
                internalType: "bool",
              },
              {
                name: "reverseWrap",
                type: "bool",
                internalType: "bool",
              },
              { name: "isDeposit", type: "bool", internalType: "bool" },
              { name: "key", type: "bytes32", internalType: "bytes32" },
              {
                name: "priceRequestKey",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
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
          { name: "key", type: "bytes32", internalType: "bytes32" },
          {
            name: "longBorrowFeesUsd",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "shortBorrowFeesUsd",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "cumulativePnl",
            type: "int256",
            internalType: "int256",
          },
          { name: "shouldUnwrap", type: "bool", internalType: "bool" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getAverageCumulativeBorrowFee",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_isLong", type: "bool", internalType: "bool" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBorrowScale",
    inputs: [{ name: "_id", type: "bytes32", internalType: "MarketId" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBorrowingRate",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_isLong", type: "bool", internalType: "bool" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getConfig",
    inputs: [{ name: "_id", type: "bytes32", internalType: "MarketId" }],
    outputs: [
      {
        name: "",
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
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCumulativeBorrowFee",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_isLong", type: "bool", internalType: "bool" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCumulativeBorrowFees",
    inputs: [{ name: "_id", type: "bytes32", internalType: "MarketId" }],
    outputs: [
      {
        name: "longCumulativeBorrowFees",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "shortCumulativeBorrowFees",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCumulatives",
    inputs: [{ name: "_id", type: "bytes32", internalType: "MarketId" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Pool.Cumulatives",
        components: [
          {
            name: "longAverageEntryPriceUsd",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "shortAverageEntryPriceUsd",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "longCumulativeBorrowFees",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "shortCumulativeBorrowFees",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "weightedAvgCumulativeLong",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "weightedAvgCumulativeShort",
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
    name: "getFundingAccrued",
    inputs: [{ name: "_id", type: "bytes32", internalType: "MarketId" }],
    outputs: [{ name: "", type: "int256", internalType: "int256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getFundingRates",
    inputs: [{ name: "_id", type: "bytes32", internalType: "MarketId" }],
    outputs: [
      { name: "", type: "int64", internalType: "int64" },
      { name: "", type: "int64", internalType: "int64" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getImpactPool",
    inputs: [{ name: "_id", type: "bytes32", internalType: "MarketId" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getImpactValues",
    inputs: [{ name: "_id", type: "bytes32", internalType: "MarketId" }],
    outputs: [
      { name: "", type: "int16", internalType: "int16" },
      { name: "", type: "int16", internalType: "int16" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getLastUpdate",
    inputs: [{ name: "_id", type: "bytes32", internalType: "MarketId" }],
    outputs: [{ name: "", type: "uint48", internalType: "uint48" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getOpenInterest",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_isLong", type: "bool", internalType: "bool" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRequest",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_requestKey", type: "bytes32", internalType: "bytes32" },
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
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRequestAtIndex",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_index", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      {
        name: "request",
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
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRewardTracker",
    inputs: [{ name: "_id", type: "bytes32", internalType: "MarketId" }],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IRewardTracker",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getStorage",
    inputs: [{ name: "_id", type: "bytes32", internalType: "MarketId" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Pool.Storage",
        components: [
          {
            name: "config",
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
              {
                name: "skewScale",
                type: "int48",
                internalType: "int48",
              },
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
          {
            name: "cumulatives",
            type: "tuple",
            internalType: "struct Pool.Cumulatives",
            components: [
              {
                name: "longAverageEntryPriceUsd",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "shortAverageEntryPriceUsd",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "longCumulativeBorrowFees",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "shortCumulativeBorrowFees",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "weightedAvgCumulativeLong",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "weightedAvgCumulativeShort",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
          {
            name: "longOpenInterest",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "shortOpenInterest",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "fundingRate", type: "int64", internalType: "int64" },
          {
            name: "fundingRateVelocity",
            type: "int64",
            internalType: "int64",
          },
          {
            name: "longBorrowingRate",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "shortBorrowingRate",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "lastUpdate",
            type: "uint48",
            internalType: "uint48",
          },
          {
            name: "fundingAccruedUsd",
            type: "int256",
            internalType: "int256",
          },
          {
            name: "impactPool",
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
    name: "getTicker",
    inputs: [{ name: "_id", type: "bytes32", internalType: "MarketId" }],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getVault",
    inputs: [{ name: "_id", type: "bytes32", internalType: "MarketId" }],
    outputs: [{ name: "", type: "address", internalType: "contract IVault" }],
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
        name: "_tradeStorage",
        type: "address",
        internalType: "address",
      },
      { name: "_priceFeed", type: "address", internalType: "address" },
      {
        name: "_marketFactory",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "initializePool",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      {
        name: "_config",
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
      { name: "_poolOwner", type: "address", internalType: "address" },
      {
        name: "_borrowScale",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_marketToken",
        type: "address",
        internalType: "address",
      },
      { name: "_ticker", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "priceFeed",
    inputs: [],
    outputs: [
      { name: "", type: "address", internalType: "contract IPriceFeed" },
    ],
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
    name: "tradeStorage",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract ITradeStorage",
      },
    ],
    stateMutability: "view",
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
    name: "transferPoolOwnership",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_newOwner", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateConfig",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      {
        name: "_config",
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
      { name: "_borrowScale", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateImpactPool",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      {
        name: "_priceImpactUsd",
        type: "int256",
        internalType: "int256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateMarketState",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_ticker", type: "string", internalType: "string" },
      { name: "_sizeDelta", type: "uint256", internalType: "uint256" },
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
      { name: "_isLong", type: "bool", internalType: "bool" },
      { name: "_isIncrease", type: "bool", internalType: "bool" },
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
    type: "event",
    name: "FeesAccumulated",
    inputs: [
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "_isLong",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MarketConfigUpdated",
    inputs: [
      {
        name: "marketId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Market_Initialized",
    inputs: [],
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
    name: "RequestCanceled",
    inputs: [
      {
        name: "key",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "caller",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RequestCreated",
    inputs: [
      {
        name: "key",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "tokenIn",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "amountIn",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "isDeposit",
        type: "bool",
        indexed: false,
        internalType: "bool",
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
  {
    type: "event",
    name: "TokenAdded",
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
  { type: "error", name: "AlreadyInitialized", inputs: [] },
  {
    type: "error",
    name: "EnumerableMapNonexistentKey",
    inputs: [{ name: "key", type: "bytes32", internalType: "bytes32" }],
  },
  { type: "error", name: "IndexOutOfBounds", inputs: [] },
  { type: "error", name: "Market_AccessDenied", inputs: [] },
  { type: "error", name: "Market_AllocationLength", inputs: [] },
  { type: "error", name: "Market_AlreadyInitialized", inputs: [] },
  { type: "error", name: "Market_FailedToAddAssetId", inputs: [] },
  { type: "error", name: "Market_FailedToAddRequest", inputs: [] },
  { type: "error", name: "Market_FailedToRemoveRequest", inputs: [] },
  { type: "error", name: "Market_InvalidAllocation", inputs: [] },
  { type: "error", name: "Market_InvalidBorrowScale", inputs: [] },
  {
    type: "error",
    name: "Market_InvalidCumulativeAllocation",
    inputs: [],
  },
  { type: "error", name: "Market_InvalidETHTransfer", inputs: [] },
  { type: "error", name: "Market_InvalidKey", inputs: [] },
  { type: "error", name: "Market_InvalidPoolOwner", inputs: [] },
  { type: "error", name: "Market_MaxAssetsReached", inputs: [] },
  { type: "error", name: "Market_MinimumAssetsReached", inputs: [] },
  { type: "error", name: "Market_NotRequestOwner", inputs: [] },
  { type: "error", name: "Market_RequestNotExpired", inputs: [] },
  { type: "error", name: "Market_TokenAlreadyExists", inputs: [] },
  { type: "error", name: "Market_TokenDoesNotExist", inputs: [] },
  { type: "error", name: "NewOwnerIsZeroAddress", inputs: [] },
  { type: "error", name: "NoHandoverRequest", inputs: [] },
  { type: "error", name: "Pool_InvalidLiquidityScalar", inputs: [] },
  { type: "error", name: "Pool_InvalidMaxVelocity", inputs: [] },
  { type: "error", name: "Pool_InvalidReserveFactor", inputs: [] },
  { type: "error", name: "Pool_InvalidSkewScale", inputs: [] },
  { type: "error", name: "Reentrancy", inputs: [] },
  { type: "error", name: "Unauthorized", inputs: [] },
] as const;
