import mongoose, { Schema } from "mongoose";
import { BaseDocumentFields } from "./common.js";

/**
 * LocalizedTitle
 */
const LocalizedTitleSchema = new Schema(
  {
    lang: { type: String, required: true },
    region: String,
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["official", "localized", "international", "alias"],
      default: "official",
    },
    is_primary: { type: Boolean, default: false },
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
    default_lang: { type: String, default: "en" },
    slug: { type: String, required: true },
    description: LocalizedTextSchema,
    genres: [String],
    origin_country: String,
    total_movies: Number,
    popularity_score: { type: Number, default: 0 },
    banner_url: String,
    logo_url: String,
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
    default_lang: { type: String, default: "en" },
    slug: { type: String, required: true },
    description: LocalizedTextSchema,
    type: {
      type: String,
      enum: ["series", "season", "ova", "movie", "special"],
      default: "movie",
    },
    genres: {
      type: [String],
      default: [],
    },
    countries: {
      type: [String],
      default: [],
    },
    languages: {
      type: [String],
      default: [],
    },
    season_number: Number,
    total_episodes: Number,
    release_date: Date,
    end_date: Date,
    duration: Number,

    thumbnail_url: String,
    poster_url: String,
    banner_url: String,
    trailer_url: String,
    background_color: String,

    aliases: [String],
    aliases_by_region: { type: Map, of: [String] },
    keywords: [String],
    tags: [String],

    view_count: { type: Number, default: 0 },
    likes_count: { type: Number, default: 0 },
    comments_count: { type: Number, default: 0 },
    favorites_count: { type: Number, default: 0 },
    rating_average: { type: Number, default: 0 },
    rating_count: { type: Number, default: 0 },
    popularity_score: { type: Number, default: 0 },

    content_rating: {
      system: String,
      rating: String,
    },
    languages_available: [String],

    external_ids: {
      imdb: String,
      tmdb: String,
      anilist: String,
      mal: String,
    },
    region_release_dates: { type: Map, of: Date },

    cast: [
      {
        person_id: { type: Schema.Types.ObjectId, ref: "Person" },
        role: String,
      },
    ],
    crew: [
      {
        person_id: { type: Schema.Types.ObjectId, ref: "Person" },
        job: String,
      },
    ],

    metadata: { type: Schema.Types.Mixed },
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
    region: String,
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
      enum: ["hls", "dash", "progressive"],
      default: "hls",
    },
    cdn_url: String,
    backup_urls: [String],
    priority: { type: Number, default: 1 },
    active: { type: Boolean, default: true },
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
    season_number: Number,

    titles: { type: [LocalizedTitleSchema] },
    slug: String,
    episode_number: { type: Number, required: true },
    description: LocalizedTextSchema,
    thumbnail_url: String,
    link_embed: String,
    link_m3u8: String,
    duration: Number,
    air_date: Date,
    popularity_score: { type: Number, default: 0 },

    subtitles: [
      {
        language: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

/**
 * Indexes
 */
FranchiseSchema.index({ slug: 1 }, { unique: true });
MovieSchema.index({ franchise_id: 1 });
MovieSchema.index({ slug: 1 }, { unique: true });
MovieSchema.index({ popularity_score: -1 });
MovieSchema.index({ visibility_scope: 1, featured: -1 });
MovieSchema.index({ release_date: -1 });
MovieSchema.index({ genres: 1 });
MovieSchema.index({ view_count: -1 });
MovieSchema.index({ rating_average: -1 });

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
