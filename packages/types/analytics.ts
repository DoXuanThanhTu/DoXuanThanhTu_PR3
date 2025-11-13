// packages/types/analytics.ts
import { BaseDocument, DeviceType, RegionCode } from "./common";

export interface ViewRecord extends BaseDocument {
  movie_id: string;
  episode_id?: string;
  user_id?: string;
  ip_address?: string;
  device_type?: DeviceType;
  region?: RegionCode;
  viewed_at: Date;
  valid: boolean;
}

export interface AnalyticsSummary extends BaseDocument {
  movie_id: string;
  date: string;
  views: number;
  unique_users: number;
  likes: number;
  comments: number;
  favorites: number;
  popularity_score: number;
  device_breakdown?: Record<DeviceType, number>;
  region_breakdown?: Record<RegionCode, number>;
}
