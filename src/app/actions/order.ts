"use server";

import Order from "@/models/Order";
import { revalidatePath } from "next/cache";

export async function findOrders(orderNumber?: string, userId?: string) {
  try {
    if (orderNumber) {
      // Find a single order by its unique order ID
      const order = await Order.findOne({
        orderNumber: { $regex: new RegExp(orderNumber, "i") },
      });

      if (order) {
        return order
          ? {
              ...order.toObject(),
              _id: order._id.toString(),
              userId: order.userId.toString(),
            }
          : null;
      }
    } else if (userId) {
      // Find all orders for a specific user by user ID
      const orders = await Order.find({ userId });
      return orders.map((order) => ({
        ...order.toObject(),
        _id: order._id.toString(),
        userId: order.userId.toString(),
      }));
    } else {
      // Return all orders (usually for admin view)
      const orders = await Order.find();
      return orders.map((order) => ({
        ...order.toObject(),
        _id: order._id.toString(),
        userId: order.userId.toString(),
      }));
    }
  } catch (error: any) {
    console.error(`Error fetching orders: ${error.message}`);
  }
}

export async function createOrder(orderNumber: string, data: any) {
  try {
    // Check if an order with the same orderNumber already exists
    const existingOrder = await Order.findOne({ orderNumber });

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
    console.error(`Error in creating or updating order: ${error.message}`);
  }
}
