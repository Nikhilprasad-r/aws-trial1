import AWS from "aws-sdk";
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

  if (method === "PATCH") {
    try {
      const { username } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const params = {
        Bucket: bucketName,
        Key: user.s3Key,
        Expires: 60 * 5,
        ACL: "public-read",
        ContentType: "image/jpeg",
      };

      const uploadUrl = s3.getSignedUrl("putObject", params);
      res.status(200).json({
        message: "Use the URL below to upload new profile image.",
        uploadUrl,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["PATCH"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
