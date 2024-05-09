import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  password: { type: String, required: true },
  s3Path: String,
  imageUrl: String,
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const originalPassword = this.password;
      this.password = await bcrypt.hash(originalPassword, 10);
    } catch (error) {
      console.error("Error hashing password:", error);
      return next(error);
    }
  }
  next();
});
export default mongoose.models.Usertest ||
  mongoose.model("Usertest", userSchema);
