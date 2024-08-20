import { ObjectId } from "mongodb";
import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  _id: {
    type: ObjectId,
    required: [true],
  },
  url_slg: {
    type: String,
    unique: [true],
    required: [true],
  },
  dsn: {
    type: String,
    unique: [true],
    required: [true],
  },
  sku: {
    type: String,
  },
  productName: {
    type: String,
  },
  category_id: {
    type: mongoose.Types.ObjectId,
    ref: "Categories",
  },
  price: {
    type: Number,
  },
  imageUrls: {
    type: String,
  },
  department: {
    type: String,
  },
  description: {
    type: String,
  },
  brand_id: {
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

const Product = models.Product || model("Product", ProductSchema);

export default Product;
