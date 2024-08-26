import mongoose, { Schema, model, models } from "mongoose";

const BrandSchema = new Schema({
  url_slug: {
    type: String,
    unique: true,
    required: [true, "URL slug is required"],
    match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, // Example regex for slugs
  },
  brandName: {
    type: String,
    unique: true,
    required: [true, "Category name is required"],
  },
  description: {
    type: String,
    maxLength: 500, // Example constraint
  },
  imageUrl: {
    type: String,
    validate: {
      validator: function (v: string) {
        return /^https?:\/\/.+\..+$/.test(v);
      },
      message: (props: { value: string }) =>
        `${props.value} is not a valid URL!`,
    },
  },
  seo_title: {
    type: String,
    maxLength: 60,
  },
  seo_desc: {
    type: String,
    maxLength: 160,
  },
  keywords: {
    type: String,
  },
  sort_order: {
    type: Number, // Changed to Number
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const Brand = models.Brand || model("Brand", BrandSchema);

export default Brand;
