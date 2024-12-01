"use server";
import { connection } from "@/utils/connection";
import Order from "@/models/Order";
import { revalidatePath } from "next/cache";

export async function findOrders(
  orderNumber?: number | string,
  userId?: string | null
) {
  await connection();

  try {
    if (orderNumber !== undefined && orderNumber !== null) {
      // Explicitly check for non-null and non-undefined values
      const order = await Order.findOne({
        orderNumber,
      });
      if (order) {
        return {
          ...order.toObject(),
          _id: order._id.toString(),
          userId: order.userId.toString(),
        };
      }
      return null; // Explicitly return null if no order is found
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
    throw error; // Re-throw the error for proper handling
  }
}

export async function createOrder(orderNumber: string, data: any) {
  await connection();
  console.log("Data received:", data);

  if (!orderNumber || !data) {
    console.error("Missing order number or data");
    return null;
  }

  const {
    userId,
    email,
    products,
    subtotal,
    tax = 0,
    shippingCost = 0,
    total,
    paymentStatus = "pending",
    transactionId,
    paymentMethod,
    shippingAddress,
    shippingStatus = "pending",
    shippingDate,
    deliveryDate,
    orderStatus = "processing",
    notes,
    couponCode,
    discount = 0,
  } = data;

  try {
    // Check if an order with the same orderNumber exists
    const existingOrder = await Order.findOne({ orderNumber });

    if (existingOrder) {
      // Update the existing order
      const updatedOrder = await Order.findByIdAndUpdate(
        existingOrder._id,
        {
          orderNumber,
          userId,
          email,
          products,
          subtotal,
          tax,
          shippingCost,
          total,
          paymentStatus,
          transactionId,
          paymentMethod,
          shippingAddress,
          shippingStatus,
          shippingDate,
          deliveryDate,
          orderStatus,
          notes,
          couponCode,
          discount,
        },
        {
          new: true, // Return the updated document
          runValidators: true, // Validate fields based on schema
        }
      );
      revalidatePath("/admin/orders");
    } else {
      // Create a new order
      const newOrder = new Order({
        orderNumber,
        userId,
        email,
        products,
        subtotal,
        tax,
        shippingCost,
        total,
        paymentStatus,
        transactionId,
        paymentMethod,
        shippingAddress,
        shippingStatus,
        shippingDate,
        deliveryDate,
        orderStatus,
        notes,
        couponCode,
        discount,
      });
      await newOrder.save();
      revalidatePath("/admin/orders");
    }

    // Revalidate path if using server-side caching
    // Only call this if necessary in your framework
    // revalidatePath("/checkout");
  } catch (error: any) {
    console.error;
  }
}

export async function deleteOrder(orderNumber: string) {
  await connection();

  if (!orderNumber) {
    console.error("Missing order number");
    return null;
  }

  try {
    // Find and delete the order by its orderNumber
    const deletedOrder = await Order.findOneAndDelete({ orderNumber });

    if (!deletedOrder) {
      console.error(`Order with order number ${orderNumber} not found`);
      return null;
    }

    console.log(`Order with order number ${orderNumber} deleted successfully`);
    revalidatePath("/admin/orders");
  } catch (error: any) {
    console.error("Error deleting order:", error.message);
    return null;
  }
}
