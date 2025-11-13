// packages/types/user.ts
import { BaseDocument, RegionCode, DeviceType } from "./common";

// -----------------------------
// User
// -----------------------------
export interface User extends BaseDocument {
  username?: string;
  email?: string; // có thể trống nếu đăng nhập bằng OAuth hoặc khách
  passwordHash?: string; // optional vì có thể dùng OAuth
  avatar?: string;

  role?: "user" | "vip" | "premium" | "staff" | "admin";
  region?: RegionCode;

  // Trạng thái tài khoản
  verified_email?: boolean;
  banned?: boolean;
  banned_reason?: string;

  // Điểm thưởng và quyền lợi
  points?: number;
  ad_free_until?: Date;
  vip_until?: Date;
  premium_until?: Date;

  // Hành vi và liên kết
  last_login?: Date;
  last_ip?: string;
  referral_code?: string;
  referred_by?: string; // id của user khác
}

/*
Indexes:
- { email: 1 } (unique if not null)
- { username: 1 }
- { role: 1 }
- { region: 1 }
*/

// -----------------------------
// UserAuthProvider
// -----------------------------
export type AuthProviderType =
  | "local" // đăng nhập truyền thống
  | "google"
  | "facebook"
  | "apple"
  | "github"
  | "guest";

export interface UserAuthProvider extends BaseDocument {
  user_id: string;
  provider: AuthProviderType;
  provider_user_id?: string; // ID từ OAuth provider
  access_token?: string;
  refresh_token?: string;
  linked_at: Date;
  last_used?: Date;
  metadata?: Record<string, any>; // lưu data mở rộng (VD: avatar Google, locale, ...)
}

/*
Indexes:
- { user_id: 1, provider: 1 }
- { provider: 1, provider_user_id: 1 }
*/

// -----------------------------
// WatchHistory & Favorites
// -----------------------------
export interface WatchHistory extends BaseDocument {
  user_id: string;
  movie_id: string;
  episode_id?: string;
  watch_time: number;
  completion_rate?: number;
  drop_off_point?: number;
  device_type?: DeviceType;
  region?: RegionCode;
  last_watched_at: Date;
}

export interface FavoriteItem extends BaseDocument {
  user_id: string;
  movie_id?: string;
  episode_id?: string;
  franchise_id?: string;
  addedAt: Date;
}

/*
Indexes:
- { user_id: 1, movie_id: 1 }
- { last_watched_at: -1 }
*/

export interface UserList extends BaseDocument {
  user_id: string;
  name: string;
  description?: string;
}
