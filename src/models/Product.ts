import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    url_slug: {
      type: String,
      unique: true,
      required: [true, "URL slug is required"],
      trim: true,
    },
    dsin: {
      type: String,
      unique: true,
      required: [true, "DSIN is required"],
      trim: true,
    },
    sku: {
      type: String,
      trim: true,
    },
    productName: {
      type: String,
      trim: true,
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category ID is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"],
    },
    imageUrls: {
      type: [String],
      required: [true, "At least one image URL is required"],
    },
    attributes: [
      {
        groupName: {
          type: String,
          required: true,
          trim: true,
        },
        attributes: {
          type: Map,
          of: [String], // Each attribute name maps to an array of string values
          required: true,
        },
      },
    ],
    department: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    brand_id: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: false,
    },
    offerId: { type: Schema.Types.ObjectId, ref: "Offer", required: false },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Product = models.Product || model("Product", ProductSchema);

export default Product;
