import mongoose, { Schema, model, models } from "mongoose";

const VariantSchema = new Schema({
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
  VariantName: {
    type: String,
  },
  product_id: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
  },
  price: {
    type: Number,
  },
  imageUrls: {
    type: [String],
    required: true,
  },
  attributes: { type: Object },
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

const Variant = models.Variant || model("Variant", VariantSchema);

export default Variant;
