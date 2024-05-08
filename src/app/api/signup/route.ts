import dbConnect from "../../lib/mongodb";
import Usertest from "../../models/Usertest";
import { NextResponse } from "next/server";

import { type NextRequest } from 'next/server'



export async function POST(req:NextRequest, res:NextResponse) {
  const body = await req.json();
  const { firstname,
    lastname,
    email,
    phone,
    role,
    password,
    s3Path, } = body;
  try {
    
    await dbConnect();
    const newUser = new Usertest({
      firstname,
        lastname,
        email,
        phone,
        role,
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