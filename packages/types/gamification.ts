// packages/types/gamification.ts
import { BaseDocument } from "./common";

export type QuizType = "text" | "image" | "video";
export type QuizDifficulty = "easy" | "medium" | "hard";
export type RewardRarity = "common" | "rare" | "legendary";
export type RewardType =
  | "theme"
  | "cursor"
  | "background"
  | "ad_free"
  | "vip_bonus"
  | "custom";
export type LeaderboardPeriod = "daily" | "weekly" | "monthly" | "alltime";

export interface Quiz extends BaseDocument {
  movie_id?: string;
  episode_id?: string;
  franchise_id?: string;
  title: string;
  question: string;
  options: string[];
  correct_answer_index: number;
  reward_points?: number;
  difficulty?: QuizDifficulty;
  type?: QuizType;
  media_url?: string;
}

export interface UserQuizResult extends BaseDocument {
  user_id: string;
  quiz_id: string;
  movie_id?: string;
  episode_id?: string;
  is_correct: boolean;
  points_earned: number;
  answeredAt: Date;
}

export interface UserPoints extends BaseDocument {
  user_id: string;
  total_points: number;
  available_points: number;
  spent_points: number;
  lifetime_points?: number;
  last_updated: Date;
  vip_multiplier?: number;
}

export interface RewardItem extends BaseDocument {
  name: string;
  description?: string;
  type: RewardType;
  price: number;
  image_url?: string;
  duration_hours?: number;
  rarity?: RewardRarity;
  is_limited?: boolean;
  available_until?: Date;
}

export interface UserInventoryItem extends BaseDocument {
  user_id: string;
  reward_id: string;
  acquiredAt: Date;
  expiresAt?: Date;
  is_active?: boolean;
}

export interface Leaderboard extends BaseDocument {
  user_id: string;
  total_points: number;
  rank: number;
  period: LeaderboardPeriod;
}
