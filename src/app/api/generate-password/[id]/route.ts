import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import parseError from "@/app/utils/errorParser";
import { generatePassword } from "@/app/helpers/services/user";
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
    await dbConnect();
    generatePassword(id);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
