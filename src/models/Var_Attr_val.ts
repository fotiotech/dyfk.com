import { ObjectId } from "mongodb";
import mongoose, { Schema, model, models } from "mongoose";

const Var_Attr_valSchema = new Schema({
  _id: { type: ObjectId },
  id_variant: { type: mongoose.Types.ObjectId, ref: "Variant" },
  attr_val_id: { type: mongoose.Types.ObjectId, ref: "Attr_value" },
  attr_val_name: { type: Map },
  created_at: { type: Date },
  updated_at: { type: Date },
});

const Var_Attr_val =
  models.Var_Attr_val || model("Var_Attr_val", Var_Attr_valSchema);

export default Var_Attr_val;
