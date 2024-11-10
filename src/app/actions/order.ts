"use server";

import Order from "@/models/Order";
import { revalidatePath } from "next/cache";
import { CartItem } from "../reducer/cartReducer";

export async function findOrder() {
  const response = await Order.find();
  // if response is not null
  if (response) {
    return response.map((order: any) => ({
      ...order.toObject(), // Convert the Mongoose document to a plain object
      _id: order._id.toString(), // Convert ObjectId to string
      userId: order.userId.toString(), // Convert ObjectId to string
    }));
  }
}

export async function createOrder(cart: CartItem[], data: any) {
  try {
    // Check if an order with the same orderNumber already exists
    const existingOrder = await Order.findOne({ products: cart });

    if (existingOrder) {
      // If it exists, update the existing order
      const updatedOrder = await Order.findByIdAndUpdate(
        existingOrder._id,
        data,
        {
          new: true, // Return the updated document
          runValidators: true, // Run schema validations on update
        }
      );
      // Revalidate path if using server-side caching
      revalidatePath("/admin/orders");
      return updatedOrder;
    } else {
      // If it doesn't exist, create a new order
      const newOrder = new Order(data);
      const savedOrder = await newOrder.save();
      // Revalidate path if using server-side caching
      revalidatePath("/admin/orders");
      return savedOrder;
    }
  } catch (error: any) {
    throw new Error(`Error in creating or updating order: ${error.message}`);
  }
}
