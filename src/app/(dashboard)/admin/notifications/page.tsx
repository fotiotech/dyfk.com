"use client";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";

const notify = (message: string) => toast(message);

const Notifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  const socket = io("http://localhost:3000"); // Your server URL

  useEffect(() => {
    socket.on("newNotification", (notification: any) => {
      // Update the notifications state with the new notification
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  return (
    <div>
      Notifications{" "}
      <button
        title="notification"
        type="button"
        onClick={() => notify("New Order Received!")}
      >
        Show Notification
      </button>
      <ToastContainer />
    </div>
  );
};

export default Notifications;
