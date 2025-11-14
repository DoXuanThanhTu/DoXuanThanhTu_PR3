// packages/types/movie.ts
import { BaseDocument, LocalizedText } from "./common.js";

/**
 * Một tên phim có thể thay đổi tùy theo ngôn ngữ hoặc quốc gia.
 */
export interface LocalizedTitle {
  lang: string; // ISO 639-1, ví dụ: "en", "vi", "ja"
  region?: string; // ISO 3166-1 alpha-2, ví dụ: "US", "VN", "JP"
  title: string;
  type?: "official" | "localized" | "international" | "alias";
  is_primary?: boolean; // true nếu là tên chính
}

/**
 * Chuỗi phim (ví dụ: Marvel, Harry Potter, Detective Conan)
 */
export interface Franchise extends BaseDocument {
  titles: LocalizedTitle[];
  default_lang?: string;
  slug: string;

  description?: LocalizedText;
  genres?: string[];
  origin_country?: string;
  total_movies?: number;
  popularity_score?: number;

  banner_url?: string;
  logo_url?: string;
}

/**
 * Dữ liệu tóm tắt phim (dùng cho danh sách / tìm kiếm)
 */
export interface MovieSummary {
  _id: string;
  titles: LocalizedTitle[];
  slug: string;
  poster_url?: string;
  release_year?: number;
  genres?: string[];
}

/**
 * Phim hoặc season/OVA/special
 */
export interface Movie extends BaseDocument {
  // franchise có thể là ID (string) hoặc object đã populate
  franchise_id?:
    | string
    | {
        _id: string;
        slug: string;
        titles?: LocalizedTitle[];
        default_lang?: string;
      };

  titles: LocalizedTitle[];
  default_lang?: string;
  slug: string;
  name: string;
  description?: LocalizedText;
  type?: "series" | "season" | "ova" | "movie" | "special";
  season_number?: number;
  total_episodes?: number;

  release_date?: Date;
  end_date?: Date;
  duration?: number;

  genres?: string[];
  countries?: string[];
  languages?: string[];

  thumbnail_url?: string;
  poster_url?: string;
  banner_url?: string;
  trailer_url?: string;
  background_color?: string;

  aliases?: string[];
  aliases_by_region?: { [region: string]: string[] };
  keywords?: string[];
  tags?: string[];

  view_count?: number;
  likes_count?: number;
  comments_count?: number;
  favorites_count?: number;
  rating_average?: number;
  rating_count?: number;
  popularity_score?: number;

  content_rating?: {
    system: "MPAA" | "PEGI" | "IMDB" | "custom";
    rating: string;
  };

  languages_available?: string[];

  region_release_dates?: { [region: string]: Date };

  external_ids?: {
    imdb?: string;
    tmdb?: string;
    anilist?: string;
    mal?: string;
  };

  cast?: { person_id: string; role?: string }[];
  crew?: { person_id: string; job?: string }[];

  metadata?: Record<string, any>;
}

/**
 * Server stream phim (mỗi movie có thể có nhiều server)
 */
export interface Server extends BaseDocument {
  movie_id: string;
  name: string;
  region?: string;
  language: "vietsub" | "thuyết minh" | "raw";
  quality: "360p" | "480p" | "720p" | "1080p" | "4k";
  stream_type?: "hls" | "dash" | "progressive";
  cdn_url?: string;
  backup_urls?: string[];
  priority?: number;
  active?: boolean;
}

/**
 * Tập phim (Episode)
 */
export interface Episode extends BaseDocument {
  movie_id: string;
  server_id?: string;
  season_number?: number;

  titles: LocalizedTitle[];
  slug?: string;
  episode_number: number;

  description?: LocalizedText;
  thumbnail_url?: string;
  link_embed?: string;
  link_m3u8?: string;
  duration?: number;
  air_date?: Date;
  popularity_score?: number;

  subtitles?: {
    language: string;
    url: string;
  }[];
}

/*
Indexes:
- { slug: 1 } unique
- { franchise_id: 1 }
- { "titles.lang": 1, "titles.title": "text" }
- { popularity_score: -1 }
- { visibility_scope: 1, featured: -1 }
- { release_date: -1 }
- { genres: 1 }
- { view_count: -1 }
- { rating_average: -1 }
*/
