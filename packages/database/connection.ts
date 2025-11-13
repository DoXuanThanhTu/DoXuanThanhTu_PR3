import mongoose from "mongoose";
export const isValidObjectId = (value: string): boolean => {
  return mongoose.Types.ObjectId.isValid(value);
};

let isConnected = false;

export const connectDB = async (mongoUri?: string) => {
  const uri = mongoUri || process.env.MONGO_URI;
  if (!uri) throw new Error("❌ MONGO_URI not provided");

  if (isConnected) return mongoose.connection;

  mongoose.set("strictQuery", true);
  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB connected");
  });
  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
  });

  await mongoose.connect(uri);
  isConnected = true;
  return mongoose.connection;
};

export const disconnectDB = async () => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log("🛑 MongoDB disconnected");
  }
};
