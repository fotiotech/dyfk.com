import { ObjectId } from "mongodb";
import mongoose, { Schema, model, models } from "mongoose";

const CategoryFileSchema = new Schema({
  _id: {
    type: ObjectId,
    required: [true],
  },
  category_id: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
  },

  fileUrl: {
    type: String,
    unique: [true],
    required: [true],
  },
  originalName: {
    type: String,
  },
  mineType: {
    type: String,
  },
  size: {
    type: Number,
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

const CategoryFile =
  models.CategoryFile || model("CategoryFile", CategoryFileSchema);

export default CategoryFile;
