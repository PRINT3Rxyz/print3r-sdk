export const ReferralABI = [
  {
    type: "function",
    name: "applyFeeDiscount",
    inputs: [
      {
        name: "referralStorage",
        type: "IReferralStorage",
        internalType: "contract IReferralStorage",
      },
      { name: "_account", type: "address", internalType: "address" },
      { name: "_fee", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "newFee", type: "uint256", internalType: "uint256" },
      {
        name: "affiliateRebate",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "codeOwner", type: "address", internalType: "address" },
    ],
    stateMutability: "view",
  },
] as const;
