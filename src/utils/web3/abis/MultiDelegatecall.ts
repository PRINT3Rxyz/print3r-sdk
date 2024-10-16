export const MultiDelegatecallABI = [
  {
    type: "function",
    name: "multiDelegatecall",
    inputs: [
      {
        name: "calls",
        type: "tuple[]",
        internalType: "struct MultiDelegatecall.Call[]",
        components: [
          { name: "target", type: "address", internalType: "address" },
          { name: "data", type: "bytes", internalType: "bytes" },
        ],
      },
    ],
    outputs: [{ name: "results", type: "bytes[]", internalType: "bytes[]" }],
    stateMutability: "payable",
  },
  {
    type: "error",
    name: "DelegatecallFailed",
    inputs: [{ name: "index", type: "uint256", internalType: "uint256" }],
  },
] as const;
