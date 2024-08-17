import mongoose from "mongoose";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      // Add more environment variables here if needed
    }
  }
}

let isConnected = false; // track the connection

export const connection = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "fotiodb",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;

    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};
