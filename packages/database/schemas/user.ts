import { InferSchemaType, Schema, model } from "mongoose";
import { BaseDocumentFields } from "./common.js";

// -----------------------------
// 🧍 User
// -----------------------------
export const UserSchema = new Schema(
  {
    username: { type: String },
    email: { type: String },
    passwordHash: String,
    avatar: String,

    role: {
      type: String,
      enum: ["user", "vip", "premium", "staff", "admin"],
      default: "user",
    },
    region: { type: String },

    verified_email: { type: Boolean, default: false },
    banned: { type: Boolean, default: false },
    banned_reason: String,

    points: { type: Number, default: 0 },
    ad_free_until: Date,
    vip_until: Date,
    premium_until: Date,

    last_login: Date,
    last_ip: String,
    referral_code: String,
    referred_by: String,

    ...BaseDocumentFields,
  },
  { timestamps: true }
);

// 🔹 Đánh index tập trung ở đây
UserSchema.index({ email: 1 }, { unique: true, sparse: true });
UserSchema.index({ username: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ region: 1 });

export type UserSchemaType = InferSchemaType<typeof UserSchema>;
export const User = model<UserSchemaType>("User", UserSchema);

// -----------------------------
// 🔑 UserAuthProvider
// -----------------------------
export const UserAuthProviderSchema = new Schema(
  {
    user_id: { type: String, required: true },
    provider: {
      type: String,
      enum: ["local", "google", "facebook", "apple", "github", "guest"],
      required: true,
    },
    provider_user_id: { type: String },
    access_token: String,
    refresh_token: String,
    linked_at: { type: Date, required: true },
    last_used: Date,
    metadata: { type: Object },
    ...BaseDocumentFields,
  },
  { timestamps: true }
);

UserAuthProviderSchema.index({ user_id: 1, provider: 1 });
UserAuthProviderSchema.index({ provider: 1, provider_user_id: 1 });

export const UserAuthProviderModel = model(
  "UserAuthProvider",
  UserAuthProviderSchema
);

// -----------------------------
// 🎞 WatchHistory
// -----------------------------
export const WatchHistorySchema = new Schema(
  {
    user_id: { type: String, required: true },
    movie_id: { type: String, required: true },
    episode_id: { type: String },
    watch_time: { type: Number, required: true },
    completion_rate: Number,
    drop_off_point: Number,
    device_type: String,
    region: String,
    last_watched_at: { type: Date, required: true },
    ...BaseDocumentFields,
  },
  { timestamps: true }
);

// 🔹 Index riêng biệt
WatchHistorySchema.index({ user_id: 1, movie_id: 1 });
WatchHistorySchema.index({ last_watched_at: -1 });

export const WatchHistoryModel = model("WatchHistory", WatchHistorySchema);

// -----------------------------
// 💖 FavoriteItem
// -----------------------------
export const FavoriteItemSchema = new Schema(
  {
    user_id: { type: String, required: true },
    movie_id: { type: String },
    episode_id: { type: String },
    franchise_id: { type: String },
    addedAt: { type: Date, required: true },
    ...BaseDocumentFields,
  },
  { timestamps: true }
);

FavoriteItemSchema.index({ user_id: 1, movie_id: 1 });

export const FavoriteItemModel = model("FavoriteItem", FavoriteItemSchema);

// -----------------------------
// 📋 UserList
// -----------------------------
export const UserListSchema = new Schema(
  {
    user_id: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    ...BaseDocumentFields,
  },
  { timestamps: true }
);

UserListSchema.index({ user_id: 1 });
UserListSchema.index({ name: 1 });

export const UserListModel = model("UserList", UserListSchema);
