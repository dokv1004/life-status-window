export interface Stats {
  STR: number;
  INT: number;
  VIT: number;
  DEX: number;
  LUK: number;
}

export interface FriendRequest {
  uid: string;
  nickname: string;
  level: number;
  photoURL?: string;
  sentAt: number;
}

export interface Friend {
  uid: string;
  nickname: string;
  level: number;
  photoURL?: string;
  addedAt: number;
}

export interface User {
  uid: string;
  nickname: string;
  level: number;
  exp: number;
  stats: Stats;
  photoURL?: string;
  friendCode?: string;
  friends?: Friend[];
  friendRequestsSent?: FriendRequest[];
  friendRequestsReceived?: FriendRequest[];
}
