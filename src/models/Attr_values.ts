import mongoose, { Schema, model, models } from "mongoose";

const AttrValuesSchema = new Schema(
  {
    id_attributes: {
      type: mongoose.Types.ObjectId,
      ref: "Attribute",
      required: true,
    },
    attr_values: { type: [String], required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const AttrValue = models.AttrValue || model("AttrValue", AttrValuesSchema);

export default AttrValue;
