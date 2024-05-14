import { deleteObject } from "@/app/utils/s3Logics";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import parseError from "@/app/utils/types/errorParser";

export async function DELETE(req: Request, res: NextResponse) {
  const s3Pathencoded = headers().get("x-file-s3Path");
  const s3Path = decodeURIComponent(s3Pathencoded as string);
  if (typeof s3Path !== "string") {
    return NextResponse.json(
      { error: "Invalid or missing s3Path header." },
      { status: 400 }
    );
  }
  try {
    await deleteObject(s3Path);
    return NextResponse.json({ message: "File deleted" }, { status: 200 });
  } catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
