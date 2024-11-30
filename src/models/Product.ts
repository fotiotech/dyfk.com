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
    // Price Fields
    basePrice: {
      type: Number,
      required: [true, "Base price is required"],
      min: [0, "Base price must be a positive number"],
    },
    taxRate: {
      type: Number,
      default: 0, // Optional: Default tax rate (percentage)
    },
    finalPrice: {
      type: Number,
      required: [true, "Final price is required"],
      min: [0, "Final price must be a positive number"],
    },
    discount: {
      type: Map,
      of: Schema.Types.Mixed, // Discount details
      default: {}, // Example structure: { type: "percentage", value: 10 }
    },
    currency: {
      type: String,
      default: "XAF", // Default currency (Central African CFA Franc)
    },
    // Product Identification Codes
    upc: {
      type: String,
      unique: true,
      sparse: true, // This allows the field to be optional but still unique if present
      trim: true,
    },
    ean: {
      type: String,
      unique: true,
      sparse: true, // This allows the field to be optional but still unique if present
      trim: true,
    },
    gtin: {
      type: String,
      unique: true,
      sparse: true, // This allows the field to be optional but still unique if present
      trim: true,
    },
    // Inventory Fields
    stockQuantity: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock quantity cannot be negative"],
    },
    // Product Images
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
    },
    offerId: {
      type: Schema.Types.ObjectId,
      ref: "Offer",
      required: false, // Nullable, in case the product has no active offer
    },
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
