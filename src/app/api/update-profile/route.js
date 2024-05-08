import dbConnect from "../../lib/mongodb";
import Usertest from "../../models/Usertest";
import { NextRequest, NextResponse } from "next/server";
import { getUploadUrl } from "@/app/utils/s3imageupload";

export async function PATCH(req) {
  try {
    await dbConnect();
    const { username } = await req.body.json();
    const user = await Usertest.findOne({ username });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const uploadUrl = getUploadUrl("image/jpeg", user.s3Key);
    return NextResponse.json(
      {
        uploadUrl,
        message: "Use the URL below to upload new profile image.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.error(error.message, { status: 500 });
  }
}
