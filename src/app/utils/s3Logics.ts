import { S3 } from "aws-sdk";

const region = process.env.AWS_REGION as string;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID as string;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY as string;
const bucketName = process.env.AWS_S3_BUCKET as string;

if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
  throw new Error("Missing AWS configuration environment variables");
}

const s3 = new S3({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function getUploadUrl(
  s3Path: string
): Promise<{ uploadUrl: string }> {
  const s3params = {
    Bucket: bucketName,
    Key: s3Path,
  };

  try {
    const uploadUrl = await s3.getSignedUrlPromise("putObject", s3params);
    return { uploadUrl };
  } catch (error) {
    console.error("Error getting signed URL:", error);
    throw error;
  }
}

export async function deleteObject(s3Path: string): Promise<void> {
  const s3params = {
    Bucket: bucketName,
    Key: s3Path,
  };

  try {
    await s3.deleteObject(s3params).promise();
  } catch (error) {
    console.error("Error deleting object:", error);
    throw error;
  }
}
