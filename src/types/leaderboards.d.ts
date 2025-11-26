export interface OverallLeaderboardEntry {
  rank: number;
  uuid: string;
  username: string;
  displayName: string;
  level: number;
  experience: number;
}

export interface KillsLeaderboardEntry {
  rank: number;
  uuid: string;
  username: string;
  displayName: string;
  playerKills: number;
  deaths: number;
  killDeathRatio: number;
}

export interface PlaytimeLeaderboardEntry {
  rank: number;
  uuid: string;
  username: string;
  displayName: string;
  totalPlaytime: number;
  firstJoined: string;
}

export interface LeaderboardsData {
  overall: OverallLeaderboardEntry[];
  kills: KillsLeaderboardEntry[];
  playtime: PlaytimeLeaderboardEntry[];
}

export interface LeaderboardsResponse {
  success: boolean;
  code: number;
  data: LeaderboardsData;
  messages: string[];
}
