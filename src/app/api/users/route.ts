import dbConnect from "@/app/lib/mongodb";
import Usertest from "@/app/models/Usertest";
import {  } from "next";
import { NextRequest,NextResponse } from "next/server";
import  parseError  from "../../utils/errorParser";

export async function GET(req:NextRequest, res: NextResponse) {
  try {
    await dbConnect();
    const users = await Usertest.find({});
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}



