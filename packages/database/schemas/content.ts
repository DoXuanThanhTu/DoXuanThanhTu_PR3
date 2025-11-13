import { Schema, model } from "mongoose";

/* ---------------------- COMMENT ---------------------- */
const CommentSchema = new Schema(
  {
    user_id: { type: String, required: true },
    movie_id: { type: String },
    episode_id: { type: String },
    content: { type: String, required: true },
    parent_id: { type: String },

    created_by: String,
    updated_by: String,
    approved_by: String,
    visibility_status: String,
    visibility_scope: String,
    publish_status: String,
    seo: Object,
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

CommentSchema.index({ movie_id: 1, episode_id: 1 });
CommentSchema.index({ parent_id: 1 });
CommentSchema.index({ createdAt: -1 });

export const CommentModel = model("Comment", CommentSchema);

/* ---------------------- RATING ---------------------- */
const RatingSchema = new Schema(
  {
    user_id: { type: String, required: true },
    movie_id: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 10 },
    review: String,

    created_by: String,
    updated_by: String,
    approved_by: String,
    publish_status: String,
  },
  { timestamps: true }
);

RatingSchema.index({ movie_id: 1, user_id: 1 }, { unique: true });

export const RatingModel = model("Rating", RatingSchema);

/* ---------------------- GALLERY ---------------------- */
const GallerySchema = new Schema(
  {
    movie_id: { type: String },
    episode_id: { type: String },
    url: { type: String, required: true },
    type: {
      type: String,
      enum: ["poster", "concept", "scene", "behind"],
      default: "poster",
    },

    created_by: String,
    updated_by: String,
  },
  { timestamps: true }
);

GallerySchema.index({ movie_id: 1 });
GallerySchema.index({ episode_id: 1 });

export const GalleryModel = model("Gallery", GallerySchema);

/* ---------------------- BEHIND THE SCENES ---------------------- */
const BehindTheScenesSchema = new Schema(
  {
    movie_id: { type: String },
    episode_id: { type: String },
    title: String,
    video_url: String,
    description: String,

    created_by: String,
    updated_by: String,
  },
  { timestamps: true }
);

export const BehindTheScenesModel = model(
  "BehindTheScenes",
  BehindTheScenesSchema
);

/* ---------------------- SOUNDTRACK ---------------------- */
const SoundtrackSchema = new Schema(
  {
    movie_id: { type: String },
    title: { type: String, required: true },
    artist: String,
    url: String,
    type: {
      type: String,
      enum: ["opening", "ending", "insert", "bgm"],
      default: "bgm",
    },

    created_by: String,
    updated_by: String,
  },
  { timestamps: true }
);

export const SoundtrackModel = model("Soundtrack", SoundtrackSchema);

/* ---------------------- TRIVIA ---------------------- */
const TriviaSchema = new Schema(
  {
    movie_id: { type: String },
    episode_id: { type: String },
    title: String,
    content: { type: String, required: true },
    source: String,

    created_by: String,
    updated_by: String,
  },
  { timestamps: true }
);

TriviaSchema.index({ movie_id: 1 });
TriviaSchema.index({ episode_id: 1 });

export const TriviaModel = model("Trivia", TriviaSchema);

/* ---------------------- EPISODE EXTRAS ---------------------- */
const EpisodeExtrasSchema = new Schema(
  {
    episode_id: { type: String, required: true },
    type: {
      type: String,
      enum: ["preview", "interview", "behind_the_scenes"],
      required: true,
    },
    title: String,
    video_url: String,

    created_by: String,
    updated_by: String,
  },
  { timestamps: true }
);

export const EpisodeExtrasModel = model("EpisodeExtras", EpisodeExtrasSchema);

/* ---------------------- TRAILER ---------------------- */
const TrailerSchema = new Schema(
  {
    movie_id: { type: String, required: true },
    type: {
      type: String,
      enum: ["trailer", "teaser", "highlight"],
      default: "trailer",
    },
    video_url: { type: String, required: true },

    created_by: String,
    updated_by: String,
  },
  { timestamps: true }
);

export const TrailerModel = model("Trailer", TrailerSchema);
