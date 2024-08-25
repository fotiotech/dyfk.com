import { ObjectId } from "mongodb";
import mongoose, { Schema, model, models } from "mongoose";

const AttributesSchema = new Schema({
  category_id: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
  },
  names: { type: String },

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

const Attribute = models.Attribute || model("Attribute", AttributesSchema);

export default Attribute;
