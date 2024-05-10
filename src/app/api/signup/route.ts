import dbConnect from "@/app/lib/mongodb";
import Usertest from "@/app/models/Usertest";
import { NextResponse } from "next/server";
import parseError from "@/app/utils/errorParser";
import { type NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  await dbConnect();

  const body = await req.json();
  const { firstname, lastname, email, phone, role, s3Path, imageUrl } = body;

  try {
    const existingUser = await Usertest.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or phone already exists." },
        { status: 409 }
      );
    }
    const newUser = new Usertest({
      firstname,
      lastname,
      email,
      phone,
      role,
      s3Path,
      imageUrl,
    });

    await newUser.save();
    return NextResponse.json(
      { message: "User created successfully", userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
