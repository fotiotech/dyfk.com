import axios from "axios";

export const triggerNotification = async (userId: string, message: string) => {
  try {
    const res = await axios.post("/api/notify", { userId, message });
    console.log(res);
    if (res.data.status === "Notification sent") {
      console.log("Notification triggered successfully");
    }
  } catch (error) {
    console.error("Error triggering notification:", error);
  }
};
