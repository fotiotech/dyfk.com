import mongoose, { Schema, models } from "mongoose";

const VariantSchema = new Schema({
  product_id: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    // required: true,
  },
  VProductCode: {
    type: String,
  },
  url_slug: {
    type: String,
  },
  dsin: {
    type: String,
  },
  sku: {
    type: String,
    trim: true,
  },
  productName: {
    type: String,
    trim: true,
    required: [true, "Product name is required"],
  },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category ID is required"],
  },
  brand_id: {
    type: Schema.Types.ObjectId,
    ref: "Brand",
    required: [true, "Brand ID is required"],
  },
  department: {
    type: String,
    trim: true,
    required: [true, "Department is required"],
  },
  description: {
    type: String,
    trim: true,
  },
  basePrice: {
    type: Number,
    required: [true, "Base price is required"],
    min: [0, "Base price must be a positive number"],
  },
  taxRate: {
    type: Number,
    default: 0,
  },
  finalPrice: {
    type: Number,
    required: [true, "Final price is required"],
    min: [0, "Final price must be a positive number"],
  },
  discount: {
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: false,
    },
    value: {
      type: Number,
      min: [0, "Discount value cannot be negative"],
      required: false,
    },
  },
  currency: {
    type: String,
    default: "XAF",
  },
  stockQuantity: {
    type: Number,
    required: [true, "Stock quantity is required"],
    min: [0, "Stock quantity cannot be negative"],
  },
  imageUrls: {
    type: [String],
    required: [true, "At least one image URL is required"],
  },
  variantAttributes: [
    {
      groupName: {
        type: String,
        required: true,
      },
      attributes: {
        type: Map,
        of: String,
      },
    },
  ],
  // offerId: {
  //   type: Schema.Types.ObjectId,
  //   ref: "Offer",
  //   required: false,
  // },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

export const Variant =
  models.Variant || mongoose.model("Variant", VariantSchema);