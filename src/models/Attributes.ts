import mongoose, { Schema, model, models, Document } from "mongoose";

// Attribute Interface
interface IAttribute extends Document {
    name: string;
    category_id: mongoose.Types.ObjectId;
  }
  
  // Attribute Schema
  const AttributeSchema = new Schema<IAttribute>({
    name: {
      type: String,
      required: [true, "Attribute name is required"],
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  });
  
  // Attribute Model
  const Attribute = models.Attribute || model<IAttribute>("Attribute", AttributeSchema);
  export default Attribute;
  