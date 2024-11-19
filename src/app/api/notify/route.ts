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

// Your API route that triggers the event
export async function POST(request: Request) {
  const { message } = await request.json();

  // Trigger an event on a channel
  pusher.trigger("admin/notifications", "new-notification", {
    message,
  });

  return NextResponse.json({ status: "Notification sent" });
}
