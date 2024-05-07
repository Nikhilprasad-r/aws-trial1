import dbConnect from "../../lib/mongodb";
import Usertest from "../../models/Usertest";
import { NextApiRequest,NextApiResponse } from "next";
import { NextResponse } from "next/server";

import { type NextRequest } from 'next/server'



export async function POST(req:NextRequest, res:NextApiResponse) {
  const body = await req.json();
  const { username, password, s3Path } = body;
  console.log("hel",s3Path);
  try {
    
    await dbConnect();
    const newUser = new Usertest({
      username,
      password,
      s3Path,
    });

    await newUser.save();
    return NextResponse.json({ userId: 123 }, { status: 201 })
  } catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
function parseError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
}