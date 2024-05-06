import AWS from "aws-sdk";
import bcrypt from "bcryptjs";
import dbConnect from "../lib/mongodb";
import User from "../models/User";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
});

const s3 = new AWS.S3();
const bucketName = process.env.AWS_S3_BUCKET;

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === "POST") {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const s3Key = `profiles/${username}-${Date.now()}`;
      const params = {
        Bucket: bucketName,
        Key: s3Key,
        Expires: 60 * 5,
        ACL: "public-read",
        ContentType: "image/jpeg",
      };

      const uploadUrl = s3.getSignedUrl("putObject", params);

      const newUser = new User({
        username,
        password: hashedPassword,
        profileImageUrl: `https://${bucketName}.s3.amazonaws.com/${s3Key}`,
        s3Key,
      });

      await newUser.save();
      res.status(201).json({ newUser, uploadUrl });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
