import dbConnect from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import parseError from "@/app/utils/types/errorParser";
import { type NextRequest } from "next/server";
import { newUser } from "@/app/helpers/services/user";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    await dbConnect();
    const body = await req.json();
    const newuser = await newUser(body);

    return NextResponse.json(
      { message: "User created successfully", userId: newuser._id },
      { status: 201 }
    );
  } catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
