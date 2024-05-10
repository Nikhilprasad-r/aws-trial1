import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import dbConnect from "@/app/lib/mongodb";
import Usertest from "@/app/models/Usertest";
import parseError from "@/app/utils/errorParser";

export const newUser = async (body: any) => {
  try {
    const { firstname, lastname, email, phone, role, s3Path, imageUrl } = body;

    const existingUser = await Usertest.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingUser) {
      return { error: "User with this email or phone already exists." };
    }

    const password = await bcrypt.hash(randomUUID(), 10);
    const newUser = new Usertest({
      firstname,
      lastname,
      email,
      phone,
      password,
      role,
      s3Path,
      imageUrl,
    });

    await newUser.save();
    return { message: "User created successfully", userId: newUser._id };
  } catch (error) {
    const message = parseError(error);
    return { error: message };
  }
};

export const generatePassword = async (id: string) => {
  try {
    await dbConnect();
    const user = await Usertest.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    const password = await bcrypt.hash(randomUUID(), 10);
    user.password = password;
    user.isactive = true;
    await user.save();
    return { status: 200 };
  } catch (error) {
    const message = parseError(error);
    return { error: message };
  }
};

export const deleteUser = async (id: string) => {
  try {
    await dbConnect();
    console.log("Deleting user with id:", id);
    await Usertest.findByIdAndDelete(id);
    return { status: 200 };
  } catch (error) {
    const message = parseError(error);
    return { error: message };
  }
};
export const updateUser = async (id: string, body: any) => {
  try {
    await dbConnect();
    await Usertest.findByIdAndUpdate(id, { ...body });
    return { status: 200 };
  } catch (error) {
    const message = parseError(error);
    return { error: message };
  }
};
export const getUsers = async () => {
  try {
    await dbConnect();
    const users = await Usertest.find();
    return { users };
  } catch (error) {
    const message = parseError(error);
    return { error: message };
  }
};
