import mongoose, { Schema } from "mongoose";

interface Product {
  productId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
}

interface OrderDocument extends Document {
  orderNumber: string;
  userId: mongoose.Types.ObjectId;
  products: Product[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  paymentStatus: "pending" | "paid" | "failed";
  paymentMethod: string;
  transactionId?: string | number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  shippingStatus: "pending" | "shipped" | "delivered";
  shippingDate?: Date;
  deliveryDate?: Date;
  orderStatus: "processing" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  couponCode?: string;
  discount: number;
}

const orderSchema = new Schema<OrderDocument>(
  {
    orderNumber: { type: String, unique: true, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String, unique: true, sparse: true },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    shippingStatus: {
      type: String,
      enum: ["pending", "shipped", "delivered"],
      default: "pending",
    },
    shippingDate: { type: Date },
    deliveryDate: { type: Date },
    orderStatus: {
      type: String,
      enum: ["processing", "completed", "cancelled"],
      default: "processing",
    },
    notes: { type: String },
    couponCode: { type: String },
    discount: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const Order =
  mongoose.models?.Order || mongoose.model<OrderDocument>("Order", orderSchema);
export default Order;
