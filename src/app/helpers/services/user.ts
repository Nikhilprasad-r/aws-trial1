import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import Usertest from "@/app/models/Usertest";

export const newUser = async (body: any) => {
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
  return newUser;
};

export const generatePassword = async (id: string) => {
  const user = await Usertest.findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  const password = await bcrypt.hash(randomUUID(), 10);
  user.password = password;
  user.isactive = true;
  await user.save();
};

export const deleteUser = async (id: string) => {
  await Usertest.findByIdAndDelete(id);
};
export const updateUser = async (id: string, body: any) => {
  const { firstname, lastname, email, phone, role } = body;
  const update = {
    $set: {
      ...(firstname && { firstname }),
      ...(lastname && { lastname }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(role && { role }),
    },
  };

  const updateResult = await Usertest.findByIdAndUpdate(id, update, {
    new: true,
  });
  if (!updateResult) {
    throw new Error("User not found");
  }
};
export const getUsers = async () => {
  const users = await Usertest.find();
  return users;
};
