export type XpHistory = {
  id: number;
  xpValue: number;
  currentXp: number;
  date: Date;
  metadata: {
    method: "airdrop" | "trade" | "liquidity" | "deduction";
    market?: string | null;
    chainId: number;
    [key: string]: any;
  };
} | null;

export type Xp = {
  id: number;
  currentXp: number;
  lastManualUpdate: Date | null;
  lastAutoUpdate: Date | null;
  xpHistory: XpHistory[] | null;
} | null;

export type UserData = {
  id: number;
  address: string | null;
  ensName: string | null;
  twitterUsername: string | null;
  discordId: string | null;
  xp: Xp;
};
