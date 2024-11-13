import { Schema, model, Types } from "mongoose";

const NotificationSchema = new Schema({
  user: { type: Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ["order", "payment", "promotion", "product"],
    required: true,
  },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notification = model("Notification", NotificationSchema);

export default Notification;
