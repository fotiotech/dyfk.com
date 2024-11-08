import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  url_slug: {
    type: String,
    unique: [true],
    required: [true],
  },
  dsin: {
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
  category_id: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: {
    type: Number,
  },
  imageUrls: {
    type: [String],
    required: true,
  },
  attributes: [{ type: Object }],
  department: {
    type: String,
  },
  description: {
    type: String,
  },
  brand_id: {
    type: mongoose.Types.ObjectId,
    ref: "Brand",
  },
  status: {
    type: String,
  },
  created_at: {
    type: String,
    default: Date.now,
  },
  updated_ad: {
    type: String,
  },
});

const Product = models.Product || model("Product", ProductSchema);

export default Product;
