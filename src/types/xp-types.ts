export interface LeaderBoardData {
  rank: number;
  address: string;
  xp: number;
}

export type LeaderBoardResponse = {
  userLeaderBoardData?: LeaderBoardData;
  leaderBoardData: LeaderBoardData[];
};

export type ActivityData = {
  trading_activities: number;
  liquidity_provision: number;
  referrals_volume: number;
  my_market_performance: number;
};
