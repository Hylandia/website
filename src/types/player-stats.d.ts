export interface PlayerStats {
  player: {
    uuid: string;
    username: string;
    displayName: string;
    firstJoined: string;
    lastSeen: string;
    totalPlaytime: number;
    level: number;
    experience: number;
  };
  statistics: {
    general: {
      deaths: number;
      playerKills: number;
      mobKills: number;
      damageDealt: number;
      damageTaken: number;
      blocksPlaced: number;
      blocksBroken: number;
      distanceWalked: number;
      distanceSprinted: number;
      jumps: number;
      itemsPickedUp: number;
      itemsDropped: number;
    };
    economy: {
      balance: number;
      totalEarned: number;
      totalSpent: number;
    };
    combat: {
      killDeathRatio: number;
      longestKillStreak: number;
      currentKillStreak: number;
      weaponStats: {
        [key: string]: {
          kills: number;
          damage: number;
          accuracy?: number;
        };
      };
    };
    skills: {
      [key: string]: {
        level: number;
        experience: number;
      };
    };
    achievements: {
      total: number;
      completed: number;
      inProgress: number;
      locked: number;
    };
  };
  rankings: {
    overall: {
      rank: number;
      percentile: number;
    };
    kills: {
      rank: number;
      percentile: number;
    };
    playtime: {
      rank: number;
      percentile: number;
    };
  };
}

export interface PlayerStatsResponse {
  success: boolean;
  code: number;
  data: PlayerStats;
  messages: string[];
}
