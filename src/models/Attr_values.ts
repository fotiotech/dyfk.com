import { ObjectId } from "mongodb";
import mongoose, { Schema, model, models } from "mongoose";

const Attr_valuesSchema = new Schema({
  _id: { type: ObjectId },
  id_attributes: { type: mongoose.Types.ObjectId, ref: "Attribute" },
  attr_values: { type: Map },
  created_at: { type: Date },
  updated_at: { type: Date },
});

const Attr_value = models.Attr_value || model("Attr_value", Attr_valuesSchema);

export default Attr_value;
