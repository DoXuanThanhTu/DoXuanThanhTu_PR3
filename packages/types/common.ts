// packages/types/common.ts

export type VisibilityStatus = "public" | "vip" | "staff" | "hidden";
export type AccessLevel = "free" | "vip" | "premium" | "staff_only";
export type VisibilityScope = "public" | "vip" | "staff";
export type DeviceType = "mobile" | "desktop" | "tablet" | "tv";
export type RegionCode = string; // ISO 3166-1 alpha-2
export type LocalizedText = { [lang: string]: string };
export type PublishStatus =
  | "draft"
  | "review"
  | "published"
  | "archived"
  | "pending";
export type SortOrder = "asc" | "desc";

/**
 * Dấu vết người thao tác / kiểm duyệt
 */
export interface AuditTrail {
  created_by?: string;
  updated_by?: string;
  approved_by?: string;
}

/**
 * Dữ liệu SEO cho trang chi tiết
 */
export interface SeoMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical_url?: string;
  og_image?: string;
  language_default?: string;
}

/**
 * Base cho mọi tài liệu (schema)
 */
export interface BaseDocument extends AuditTrail {
  _id?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  publish_status?: PublishStatus;

  // hiển thị
  visibility_status?: VisibilityStatus;
  visibility_scope?: VisibilityScope;
  featured?: boolean;
  featured_until?: Date;
  status_reason?: string;

  // kiểm duyệt
  hidden_at?: Date;
  hidden_by?: string;

  // bảo mật / kiểm soát truy cập
  ip_whitelist?: string[];
  ip_blacklist?: string[];

  // SEO metadata
  seo?: SeoMetadata;
}

/*
Indexes:
- { visibility_scope: 1 }
- { featured: 1, featured_until: 1 }
- { createdAt: -1 }
*/
