import { Schema } from "mongoose";
export const SeoMetadataSchema = new Schema(
  {
    title: String,
    description: String,
    keywords: [String],
    canonical_url: String,
    og_image: String,
    language_default: String,
  },
  { _id: false }
);

export const AuditTrailSchema = new Schema(
  {
    created_by: String,
    updated_by: String,
    approved_by: String,
  },
  { _id: false }
);

export const BaseDocumentFields = {
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  publish_status: {
    type: String,
    enum: ["draft", "review", "published", "archived", "pending"],
    default: "draft",
  },

  visibility_status: {
    type: String,
    enum: ["public", "vip", "staff", "hidden"],
    default: "public",
  },
  visibility_scope: {
    type: String,
    enum: ["public", "vip", "staff"],
    default: "public",
  },
  featured: { type: Boolean, default: false },
  featured_until: Date,
  status_reason: String,

  hidden_at: Date,
  hidden_by: String,
  deletedAt: Date,

  ip_whitelist: [String],
  ip_blacklist: [String],

  seo: { type: SeoMetadataSchema },
  ...AuditTrailSchema.obj,
};
