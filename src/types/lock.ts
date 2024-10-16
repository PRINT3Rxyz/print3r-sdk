export type Lock = {
  depositAmount: bigint;
  lockedAt: number;
  unlockDate: number;
  owner: `0x${string}`;
  lockKey: `0x${string}`;
};
