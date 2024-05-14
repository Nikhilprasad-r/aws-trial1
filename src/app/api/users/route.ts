import dbConnect from "@/app/lib/mongodb";
import Usertest from "@/app/models/Usertest";
import { NextResponse } from "next/server";
import parseError from "@/app/utils/types/errorParser";
import { getUsers } from "@/app/helpers/services/user";
import { S3 } from "aws-sdk";

export async function GET(req: Request, res: NextResponse) {
  try {
    await dbConnect();
    const userslist = await getUsers();
    if (!userslist) {
      return NextResponse.json({ error: "No users found" }, { status: 404 });
    }
    const users = userslist.map((user) => ({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      email: user.email,
      s3Path: user.s3Path,
      imageUrl: user.imageUrl,
      role: user.role,
    }));
    console.log(users);
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
