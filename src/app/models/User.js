import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  profileImageUrl: String,
  s3Key: String,
});

export default mongoose.model("User", userSchema);
