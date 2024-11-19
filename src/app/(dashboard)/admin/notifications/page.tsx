"use client";

import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const Dashboard = () => {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    // Initialize Pusher client
    const pusher = new Pusher(
      process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER as string,
      }
    );

    // Subscribe to a channel
    const channel = pusher.subscribe("admin/notifications");

    // Listen for 'new-notification' events
    channel.bind("new-notification", (data: { message: string }) => {
      // Show notification with React Toastify
      toast.success(data.message);
      setNotifications((prev) => [...prev, data.message]);
    });

    // Cleanup when component unmounts
    return () => {
      pusher.unsubscribe("admin/notifications");
    };
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ToastContainer />
      <div>
        <h2>Recent Notifications:</h2>
        {notifications.map((message, idx) => (
          <div key={idx}>{message}</div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
