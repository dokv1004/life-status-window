import { Stats } from './user';

export interface ActionResult {
  stats: Stats;
  comment: string;
}

export interface ActionApiResponse {
  success: boolean;
  result: ActionResult;
  stats: Stats;
  level: number;
  exp: number;
  leveledUp: boolean;
}
