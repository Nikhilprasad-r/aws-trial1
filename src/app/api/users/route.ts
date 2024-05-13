import dbConnect from "@/app/lib/mongodb";
import Usertest from "@/app/models/Usertest";
import { NextResponse } from "next/server";
import parseError from "@/app/utils/types/errorParser";
import { getUsers } from "@/app/helpers/services/user";

export async function GET(req: Request, res: NextResponse) {
  try {
    await dbConnect();
    const users = await getUsers();
    if (!users) {
      return NextResponse.json({ error: "No users found" }, { status: 404 });
    }
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
