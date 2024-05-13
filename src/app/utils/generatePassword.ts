import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export const passwordGenerator = async () => {
  const password = await bcrypt.hash(randomUUID(), 10);
  return password;
};
