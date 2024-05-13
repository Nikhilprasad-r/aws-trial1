import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import parseError from "@/app/utils/types/errorParser";
import { assignPassword } from "@/app/helpers/services/user";
type Params = {
  id: string;
};

export async function POST(
  req: Request,
  context: { params: Params },
  res: NextResponse
) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json({ error: "Id is required" }, { status: 400 });
    }
    await dbConnect();
    await assignPassword(id);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
