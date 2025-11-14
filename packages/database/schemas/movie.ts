import mongoose, { Schema } from "mongoose";
import { BaseDocumentFields } from "./common.js";

/**
 * LocalizedTitle
 */
const LocalizedTitleSchema = new Schema(
  {
    lang: { type: String, required: true },
    title: { type: String, required: true },
  },
  { _id: false }
);

/**
 * LocalizedText: { [lang]: string }
 */
const LocalizedTextSchema = new Schema({}, { strict: false, _id: false });

/**
 * Franchise
 */
const FranchiseSchema = new Schema(
  {
    ...BaseDocumentFields,

    titles: { type: [LocalizedTitleSchema], required: true },
    slug: { type: String, required: true, unique: true },
    description: LocalizedTextSchema,
    default_lang: { type: String, default: "en" },
  },
  { timestamps: true }
);

/**
 * Movie
 */
const MovieSchema = new Schema(
  {
    ...BaseDocumentFields,

    franchise_id: { type: Schema.Types.ObjectId, ref: "Franchise" },

    titles: { type: [LocalizedTitleSchema], required: true },
    slug: { type: String, required: true, unique: true },
    description: LocalizedTextSchema,
    default_lang: { type: String, default: "en" },

    type: {
      type: String,
      enum: ["series", "season", "ova", "movie", "special"],
      default: "movie",
    },

    status: {
      type: String,
      enum: ["ongoing", "completed", "upcoming"],
      default: "ongoing",
    },

    season_number: Number,
    total_episodes: Number,
    release_date: Date,
    duration: Number,

    poster_url: String,
    thumbnail_url: String,
    banner_url: String,
    trailer_url: String,

    genres: [String],
  },
  { timestamps: true }
);

/**
 * Server
 */
const ServerSchema = new Schema(
  {
    ...BaseDocumentFields,

    movie_id: { type: Schema.Types.ObjectId, ref: "Movie", required: true },

    name: { type: String, required: true },

    language: {
      type: String,
      enum: ["vietsub", "thuyết minh", "raw"],
      default: "vietsub",
    },

    quality: {
      type: String,
      enum: ["360p", "480p", "720p", "1080p", "4k"],
      default: "720p",
    },

    stream_type: {
      type: String,
      enum: ["hls", "dash"],
      default: "hls",
    },
  },
  { timestamps: true }
);

/**
 * Episode
 */
const EpisodeSchema = new Schema(
  {
    ...BaseDocumentFields,

    movie_id: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
    server_id: { type: Schema.Types.ObjectId, ref: "Server" },

    episode_number: { type: Number, required: true },
    season_number: Number,

    titles: [LocalizedTitleSchema],
    description: LocalizedTextSchema,
    thumbnail_url: String,
    link_embed: String,
    link_m3u8: String,
    duration: Number,
    air_date: Date,
  },
  { timestamps: true }
);

/**
 * Indexes
 */
MovieSchema.index({ franchise_id: 1 });
MovieSchema.index({ slug: 1 }, { unique: true });
MovieSchema.index({ genres: 1 });
MovieSchema.index({ release_date: -1 });

export type FranchiseModelType = mongoose.InferSchemaType<
  typeof FranchiseSchema
>;
export type ServerModelType = mongoose.InferSchemaType<typeof ServerSchema>;
export type EpisodeModelType = mongoose.InferSchemaType<typeof EpisodeSchema>;
export type MovieModelType = mongoose.InferSchemaType<typeof MovieSchema>;
/**
 * Xuất models
 */
export const Franchise = mongoose.model<FranchiseModelType>(
  "Franchise",
  FranchiseSchema
);

export const Movie = mongoose.model<MovieModelType>("Movie", MovieSchema);
export const Server = mongoose.model<ServerModelType>("Server", ServerSchema);
export const Episode = mongoose.model<EpisodeModelType>(
  "Episode",
  EpisodeSchema
);
