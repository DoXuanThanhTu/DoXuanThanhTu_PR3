import { Schema } from "mongoose";
export const SeoMetadataSchema = new Schema(
  {
    title: String,
    description: String,
  },
  { _id: false }
);

export const BaseDocumentFields = {
  is_deleted: { type: Boolean, default: false },
  seo: SeoMetadataSchema,
};
