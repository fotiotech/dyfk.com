import { ObjectId } from "mongodb";
import mongoose, { Schema, model, models } from "mongoose";

const CategorySchema = new Schema({
  _id: {
    type: ObjectId,
    required: [true],
  },
  url_slug: {
    type: String,
    unique: [true],
  },

  categoryName: {
    type: String,
    unique: [true],
    required: [true],
  },
  parent_id: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  seo_title: {
    type: String,
  },
  seo_desc: {
    type: String,
  },
  keywords: {
    type: String,
  },
  sort_order: {
    type: String,
  },
  status: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_ad: {
    type: Date,
    default: Date.now,
  },
});

const Category = models.Category || model("Category", CategorySchema);

export default Category;
