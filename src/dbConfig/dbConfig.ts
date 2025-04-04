import mongoose from "mongoose";

let isConnected = false; // Prevent multiple connections

export async function Connect() {
  if (isConnected) {
    console.log("🔗 Using existing MongoDB connection");
    return;
  }

  try {
    // Setup connection listeners
    mongoose.connection.on("connected", () => {
      console.log("✅ Connected to the database");
      isConnected = true;
    });

    mongoose.connection.on("error", (error) => {
      console.error("❌ Error connecting to the database:", error);
      isConnected = false;
    });

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("🔗 Connection status:", mongoose.connection.readyState);


  } catch (error: any) {
    console.error("❗️ Initial connection error:", error.message);
    throw new Error("Database connection failed");
  }
}
