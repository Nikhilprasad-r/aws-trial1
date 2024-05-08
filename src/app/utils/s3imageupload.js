import AWS from "aws-sdk";
import { randomUUID } from "crypto";
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const bucketName = process.env.AWS_S3_BUCKET;

export async function getUploadUrl(fileType, path) {
  const s3Path = path || `user/${randomUUID()}.${fileType.split("/")[1]}`;
  const s3params = {
    Bucket: bucketName,
    Key: s3Path,
  };

  try {
    const uploadUrl = await s3.getSignedUrlPromise("putObject", s3params);
    console.log("Got signed URL:", s3Path);
    return { uploadUrl, s3Path };
  } catch (error) {
    console.error("Error getting signed URL:", error);
    throw error;
  }
}
