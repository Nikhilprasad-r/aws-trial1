import { getUploadUrl } from "../../../utils/s3imageupload";
import { headers } from 'next/headers'
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  
  const fileTypeencoded = headers().get('x-file-type')
  const fileType = decodeURIComponent(fileTypeencoded as string);
  

  if (typeof fileType !== "string") {
    return NextResponse.json({ error: "Invalid or missing fileType header." }, { status: 400 })
   
  }
  try {
    const {uploadUrl,  s3Path } = await getUploadUrl(fileType);
    console.log("Got upload URL:", s3Path);
   return NextResponse.json({uploadUrl:uploadUrl, s3Path: s3Path }, { status: 200 })
  } catch (error) {
    const message = parseError(error);
   return  NextResponse.json({ error: message }, { status: 500 })
  }
}
function parseError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
}