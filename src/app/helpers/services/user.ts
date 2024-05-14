import Usertest from "@/app/models/Usertest";
import { passwordGenerator } from "@/app/utils/generatePassword";
import { UserDataType } from "@/app/utils/types/user";

export const newUser = async (data: Partial<UserDataType>) => {
  const { firstname, lastname, email, phone, role, s3Path, imageUrl } = data;

  const existingUser = await Usertest.findOne({
    $or: [{ email }, { phone }],
  });
  if (existingUser) {
    return { error: "User with this email or phone already exists." };
  }

  const password = await passwordGenerator();
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

export const assignPassword = async (id: string) => {
  const user = await Usertest.findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  const password = await passwordGenerator();
  user.password = password;
  user.isactive = true;
  await user.save();
};

export const deleteUser = async (id: string) => {
  const response = await Usertest.findByIdAndDelete(id);
  return response;
};
export const updateUser = async (id: string, data: Partial<UserDataType>) => {
  const { firstname, lastname, email, phone, role, s3Path, imageUrl } = data;
  const update = {
    $set: {
      ...(firstname && { firstname }),
      ...(lastname && { lastname }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(role && { role }),
      ...(s3Path && { s3Path }),
      ...(imageUrl && { imageUrl }),
    },
  };

  const updateResult = await Usertest.findByIdAndUpdate(id, update, {
    new: true,
  });
  return updateResult;
};
export const getUsers = async () => {
  const users = await Usertest.find({});
  return users;
};

export const getUserbyid = async (id: string) => {
  const user = await Usertest.findById(id);
  return user;
};
