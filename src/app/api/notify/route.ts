"use server";

import Notification from "@/models/Notification";
import User from "@/models/users";
import { NextResponse } from "next/server";
import Pusher from "pusher";

// Initialize Pusher server-side with your app credentials
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.PUSHER_APP_KEY as string,
  secret: process.env.PUSHER_APP_SECRET as string,
  cluster: process.env.PUSHER_APP_CLUSTER as string,
  useTLS: true,
});

export async function GET() {
  try {
    // Fetch notifications sorted by timestamp
    const notifications = await Notification.find().sort({ timestamp: -1 });

    // Resolve user data for each notification concurrently
    const users = await Promise.all(
      notifications.map((notification) =>
        User.findById(notification.userId).lean()
      )
    );

    // Combine notifications with their associated user data
    const notificationsWithUsers = notifications.map((notification, index) => ({
      ...notification.toObject(), // Convert Mongoose document to plain JS object
      user: users[index], // Associate user data
    }));

    console.log(notificationsWithUsers)

    return NextResponse.json(notificationsWithUsers);
  } catch (error) {
    console.error("Error fetching notifications or users:", error);
    return NextResponse.json(
      { error: "Failed to fetch data." },
      { status: 500 }
    );
  }
}

// Your API route that triggers the event
export async function POST(request: Request) {
  const { userId, message } = await request.json();

  // Save the notification in the database
  const notification = new Notification({ userId, message });
  await notification.save();

  // Trigger an event on a channel
  pusher.trigger("admin-notifications", "new-notification", {
    message,
  });

  return NextResponse.json({ status: "Notification sent" });
}
