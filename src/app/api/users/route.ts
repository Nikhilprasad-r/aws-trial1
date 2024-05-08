import dbConnect from "@/app/lib/mongodb";
import Usertest from "@/app/models/Usertest";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";


export async function GET(req:NextApiRequest, res: NextResponse) {
  try {
    await dbConnect();
    const users = await Usertest.find({});
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function parseError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
}