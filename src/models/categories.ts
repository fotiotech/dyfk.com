import { ObjectId } from "mongodb";
import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema({
  _id: {
    type: ObjectId,
    required: [true],
  },
  url_slg: {
    type: String,
    unique: [true],
    required: [true],
  },

  categoryName: {
    type: String,
    unique: [true],
    required: [true],
  },
  parent_id: {
    type: String,
  },
  description: {
    type: Number,
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
    type: String,
  },
  updated_ad: {
    type: String,
  },
});

const Category = models.Category || model("Category", CategorySchema);

export default Category;
