import { BaseDocument, LocalizedText } from "./common.js";

/**
 * Bình luận phim hoặc tập phim
 */
export interface Comment extends BaseDocument {
  user_id: string; // ID người dùng
  movie_id?: string;
  episode_id?: string;
  content: string;
  parent_id?: string; // ID bình luận cha (nếu là reply)
  likes_count?: number;
  replies_count?: number;
}

/**
 * Đánh giá phim (rating/review)
 */
export interface Rating extends BaseDocument {
  user_id: string;
  movie_id: string;
  score: number; // 1–10 hoặc 1–5 tùy logic
  review?: string;
}

/**
 * Bộ sưu tập hình ảnh của phim hoặc tập
 */
export interface Gallery extends BaseDocument {
  movie_id?: string;
  episode_id?: string;
  url: string;
  type?: "poster" | "concept" | "scene" | "behind";
  caption?: LocalizedText;
  popularity_score?: number;
}

/**
 * Video hậu trường
 */
export interface BehindTheScenes extends BaseDocument {
  movie_id?: string;
  episode_id?: string;
  title?: LocalizedText;
  video_url?: string;
  description?: LocalizedText;
  thumbnail_url?: string;
}

/**
 * Nhạc phim (OST)
 */
export interface Soundtrack extends BaseDocument {
  movie_id?: string;
  title: string;
  artist?: string;
  url?: string;
  type?: "opening" | "ending" | "insert" | "bgm";
  duration?: number;
  popularity_score?: number;
}

/**
 * Thông tin thú vị / Trivia
 */
export interface Trivia extends BaseDocument {
  movie_id?: string;
  episode_id?: string;
  title?: LocalizedText;
  content: LocalizedText;
  source?: string;
}

/**
 * Extra content cho tập phim (preview, interview, etc.)
 */
export interface EpisodeExtras extends BaseDocument {
  episode_id: string;
  type: "preview" | "interview" | "behind_the_scenes";
  title?: LocalizedText;
  video_url?: string;
  thumbnail_url?: string;
}

/**
 * Trailer phim
 */
export interface Trailer extends BaseDocument {
  movie_id: string;
  type?: "trailer" | "teaser" | "highlight";
  video_url: string;
  thumbnail_url?: string;
  duration?: number;
}

/*
Indexes:
- Comment: { movie_id: 1, episode_id: 1, parent_id: 1 }
- Rating: { movie_id: 1, user_id: 1 } unique
- Gallery: { movie_id: 1, episode_id: 1 }
- Soundtrack: { movie_id: 1, popularity_score: -1 }
- BehindTheScenes: { movie_id: 1 }
- Trailer: { movie_id: 1, type: 1 }
*/
