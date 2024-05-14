import { getUploadUrl } from "@/app/utils/s3Logics";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import parseError from "@/app/utils/types/errorParser";

export async function GET(req: Request, res: NextResponse) {
  const s3Pathencoded = headers().get("x-file-s3Path");
  const s3Path = decodeURIComponent(s3Pathencoded as string);
  if (typeof s3Path !== "string") {
    return NextResponse.json(
      { error: "Invalid or missing s3Path header." },
      { status: 400 }
    );
  }
  try {
    const { uploadUrl } = await getUploadUrl(s3Path);
    return NextResponse.json({ uploadUrl: uploadUrl }, { status: 200 });
  } catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
