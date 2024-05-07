import AWS from "aws-sdk";
import dbConnect from "../../lib/mongodb";
import Usertest from "../../models/Usertest";
import { NextRequest, NextResponse } from "next/server";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const bucketName = process.env.AWS_S3_BUCKET;

export async function PATCH(req) {
  try {
    await dbConnect();
    const { username } = await req.body.json();
    const user = await Usertest.findOne({ username });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const params = {
      Bucket: bucketName,
      Key: user.s3Key,
      Expires: 60 * 5,
      ACL: "public-read",
      ContentType: "image/jpeg",
    };

    const uploadUrl = s3.getSignedUrl("putObject", params);
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
