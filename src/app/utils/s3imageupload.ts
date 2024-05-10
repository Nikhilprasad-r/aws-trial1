import { S3 } from "aws-sdk";

const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName = process.env.AWS_S3_BUCKET;

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
