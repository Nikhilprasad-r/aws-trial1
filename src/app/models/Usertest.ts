import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  password: { type: String },
  isactive: { type: Boolean, default: false, required: true },
  s3Path: String,
  imageUrl: String,
});

export default mongoose.models.Usertest ||
  mongoose.model("Usertest", userSchema);
