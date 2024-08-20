import { ObjectId } from "mongodb";
import mongoose, { Schema, model, models } from "mongoose";

const Prod_Attr_valSchema = new Schema({
  _id: { type: ObjectId },
  id_product: { type: mongoose.Types.ObjectId, ref: "Product" },
  attr_val_id: { type: mongoose.Types.ObjectId, ref: "Attr_value" },
  attr_val_name: { type: Map },
  created_at: { type: Date },
  updated_at: { type: Date },
});

const Prod_Attr_val =
  models.Prod_Attr_val || model("Prod_Attr_val", Prod_Attr_valSchema);

export default Prod_Attr_val;
