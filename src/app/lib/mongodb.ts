import mongoose from "mongoose";

import parseError from "@/app/utils/types/errorParser";
const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI ?? "");
  } catch (error) {
    const message = parseError(error);
    console.error("MongoDB connection error:", message);
  }
};

export default dbConnect;
