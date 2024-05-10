import dbConnect from "@/app/lib/mongodb";
import Usertest from "@/app/models/Usertest";
import { NextResponse } from "next/server";
import parseError from "@/app/utils/errorParser";

export async function GET(
  req: Request,
  context: { params: Params },
  res: NextResponse
) {
  try {
    await dbConnect();
    const { id } = context.params;
    if (id) {
      const users = await Usertest.find({});
      return NextResponse.json(users, { status: 200 });
    }
    const user = await Usertest.findById(id);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
