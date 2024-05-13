import dbConnect from "@/app/lib/mongodb";
import Usertest from "@/app/models/Usertest";
import { NextResponse } from "next/server";
import parseError from "@/app/utils/types/errorParser";
import {
  deleteUser,
  getUserbyid,
  updateUser,
} from "@/app/helpers/services/user";
type Params = {
  id: string;
};
export async function GET(
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
    const user = await getUserbyid(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  context: { params: Params },
  res: NextResponse
) {
  try {
    const id = context.params.id;
    if (!id) {
      return NextResponse.json({ error: "Id is required" }, { status: 400 });
    }
    await dbConnect();
    const result = await deleteUser(id);
    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
export async function PUT(
  req: Request,
  context: { params: { id: string } },
  res: NextResponse
) {
  try {
    const body = await req.json();
    const id = context.params.id;
    if (!id || !body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    await dbConnect();
    const updaterespone = await updateUser(id, body);
    if (!updaterespone) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated" }, { status: 200 });
  } catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
