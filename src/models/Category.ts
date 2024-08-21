import mongoose, { Schema, model, models, Document, Model } from "mongoose";

// Define an interface for the Category document
interface ICategory extends Document {
  url_slug: string;
  categoryName: string;
  parent_id?: mongoose.Types.ObjectId;
  description?: string;
  imageUrl?: string;
  seo_title?: string;
  seo_desc?: string;
  keywords?: string;
  sort_order?: number;
  status?: "active" | "inactive";
  created_at?: Date;
  updated_at?: Date;
}

// Define the schema with type annotations
const CategorySchema = new Schema<ICategory>({
  url_slug: {
    type: String,
    unique: true,
    required: [true, "URL slug is required"],
    match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, // Example regex for slugs
  },
  categoryName: {
    type: String,
    unique: true,
    required: [true, "Category name is required"],
  },
  parent_id: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
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

// Middleware to auto-update `updated_at` before saving
CategorySchema.pre<ICategory>("save", function (next) {
  this.updated_at = new Date();
  next();
});

// Export the model with type annotation
const Category: Model<ICategory> =
  models.Category || model<ICategory>("Category", CategorySchema);

export default Category;
