import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Usertest from "@/app/models/Usertest";
import parseError from "@/app/utils/errorParser";
type Params = {
  id: string;
};

export async function POST(
  req: Request,
  context: { params: Params },
  res: NextResponse
) {
  try {
    const { id } = context.params;
    await dbConnect();
    const user = await Usertest.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    const randomPassword = randomUUID();
    const password = await bcrypt.hash(randomPassword, 10);
    user.password = password;
    user.isactive = true;
    await user.save();
    return NextResponse.json({ status: 200 });
  } catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
