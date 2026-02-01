export interface Stats {
  STR: number;
  INT: number;
  VIT: number;
  DEX: number;
  LUK: number;
}

export interface User {
  uid: string;
  nickname: string;
  level: number;
  exp: number;
  stats: Stats;
}
