export const TradeStorageABI = [
  {
    type: "constructor",
    inputs: [
      { name: "_market", type: "address", internalType: "address" },
      {
        name: "_referralStorage",
        type: "address",
        internalType: "address",
      },
      { name: "_priceFeed", type: "address", internalType: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "cancelOrderRequest",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_orderKey", type: "bytes32", internalType: "bytes32" },
      { name: "_isLimit", type: "bool", internalType: "bool" },
    ],
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
    name: "createOrderRequest",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
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
            type: "uint8",
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
    outputs: [{ name: "orderKey", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createPosition",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
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
      { name: "_positionKey", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "deleteOrder",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_orderKey", type: "bytes32", internalType: "bytes32" },
      { name: "_isLimit", type: "bool", internalType: "bool" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "deletePosition",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      {
        name: "_positionKey",
        type: "bytes32",
        internalType: "bytes32",
      },
      { name: "_isLong", type: "bool", internalType: "bool" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "executeAdl",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      {
        name: "_positionKey",
        type: "bytes32",
        internalType: "bytes32",
      },
      { name: "_requestKey", type: "bytes32", internalType: "bytes32" },
      { name: "_feeReceiver", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "executePositionRequest",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_orderKey", type: "bytes32", internalType: "bytes32" },
      {
        name: "_limitRequestKey",
        type: "bytes32",
        internalType: "bytes32",
      },
      { name: "_feeReceiver", type: "address", internalType: "address" },
    ],
    outputs: [
      {
        name: "feeState",
        type: "tuple",
        internalType: "struct Execution.FeeState",
        components: [
          {
            name: "afterFeeAmount",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "fundingFee",
            type: "int256",
            internalType: "int256",
          },
          {
            name: "borrowFee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "positionFee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "feeForExecutor",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "affiliateRebate",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "realizedPnl",
            type: "int256",
            internalType: "int256",
          },
          {
            name: "amountOwedToUser",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "feesToAccumulate",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "referrer",
            type: "address",
            internalType: "address",
          },
          { name: "isLiquidation", type: "bool", internalType: "bool" },
          { name: "isFullDecrease", type: "bool", internalType: "bool" },
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
            type: "uint8",
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
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getOpenPositionKeys",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_isLong", type: "bool", internalType: "bool" },
    ],
    outputs: [{ name: "", type: "bytes32[]", internalType: "bytes32[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getOrder",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_orderKey", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [
      {
        name: "",
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
            type: "uint8",
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
    name: "getOrder",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_ticker", type: "string", internalType: "string" },
      { name: "_user", type: "address", internalType: "address" },
      { name: "_isLong", type: "bool", internalType: "bool" },
      { name: "_isIncrease", type: "bool", internalType: "bool" },
      { name: "_limitPrice", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      {
        name: "",
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
            type: "uint8",
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
    name: "getOrderAtIndex",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_index", type: "uint256", internalType: "uint256" },
      { name: "_isLimit", type: "bool", internalType: "bool" },
    ],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getOrderKeys",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_isLimit", type: "bool", internalType: "bool" },
    ],
    outputs: [{ name: "", type: "bytes32[]", internalType: "bytes32[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPosition",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_ticker", type: "string", internalType: "string" },
      { name: "_user", type: "address", internalType: "address" },
      { name: "_isLong", type: "bool", internalType: "bool" },
    ],
    outputs: [
      {
        name: "",
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
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPosition",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      { name: "_positionKey", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [
      {
        name: "",
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
    ],
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
        name: "_tradeEngine",
        type: "address",
        internalType: "address",
      },
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
      { name: "_vault", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "liquidatePosition",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
      {
        name: "_positionKey",
        type: "bytes32",
        internalType: "bytes32",
      },
      { name: "_requestKey", type: "bytes32", internalType: "bytes32" },
      { name: "_liquidator", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "market",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract IMarket" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "minCancellationTime",
    inputs: [],
    outputs: [{ name: "", type: "uint64", internalType: "uint64" }],
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
    name: "priceFeed",
    inputs: [],
    outputs: [
      { name: "", type: "address", internalType: "contract IPriceFeed" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "referralStorage",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IReferralStorage",
      },
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
    name: "setMinCancellationTime",
    inputs: [
      {
        name: "_minCancellationTime",
        type: "uint64",
        internalType: "uint64",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setStopLoss",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
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
            type: "uint8",
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
      { name: "_orderKey", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [
      { name: "stopLossKey", type: "bytes32", internalType: "bytes32" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setTakeProfit",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
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
            type: "uint8",
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
      { name: "_orderKey", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [
      {
        name: "takeProfitKey",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "tradeEngine",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract ITradeEngine",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "tradeState",
    inputs: [{ name: "", type: "bytes32", internalType: "MarketId" }],
    outputs: [
      {
        name: "vault",
        type: "address",
        internalType: "contract IVault",
      },
      {
        name: "marketOrderKeys",
        type: "tuple",
        internalType: "struct EnumerableSetLib.Bytes32Set",
        components: [
          { name: "_spacer", type: "uint256", internalType: "uint256" },
        ],
      },
      {
        name: "limitOrderKeys",
        type: "tuple",
        internalType: "struct EnumerableSetLib.Bytes32Set",
        components: [
          { name: "_spacer", type: "uint256", internalType: "uint256" },
        ],
      },
      { name: "isInitialized", type: "bool", internalType: "bool" },
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
    name: "updatePosition",
    inputs: [
      { name: "_id", type: "bytes32", internalType: "MarketId" },
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
      { name: "_positionKey", type: "bytes32", internalType: "bytes32" },
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
    type: "event",
    name: "OrderRequestCancelled",
    inputs: [
      {
        name: "marketId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "_orderKey",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
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
  { type: "error", name: "IndexOutOfBounds", inputs: [] },
  { type: "error", name: "NewOwnerIsZeroAddress", inputs: [] },
  { type: "error", name: "NoHandoverRequest", inputs: [] },
  { type: "error", name: "Reentrancy", inputs: [] },
  {
    type: "error",
    name: "TradeStorage_AlreadyInitialized",
    inputs: [],
  },
  { type: "error", name: "TradeStorage_InactivePosition", inputs: [] },
  { type: "error", name: "TradeStorage_InvalidCallback", inputs: [] },
  {
    type: "error",
    name: "TradeStorage_OrderAdditionFailed",
    inputs: [],
  },
  {
    type: "error",
    name: "TradeStorage_OrderAlreadyExists",
    inputs: [],
  },
  {
    type: "error",
    name: "TradeStorage_OrderRemovalFailed",
    inputs: [],
  },
  {
    type: "error",
    name: "TradeStorage_PositionAdditionFailed",
    inputs: [],
  },
  {
    type: "error",
    name: "TradeStorage_PositionRemovalFailed",
    inputs: [],
  },
  {
    type: "error",
    name: "TradeStorage_StopLossAlreadySet",
    inputs: [],
  },
  {
    type: "error",
    name: "TradeStorage_TakeProfitAlreadySet",
    inputs: [],
  },
  { type: "error", name: "Unauthorized", inputs: [] },
] as const;
