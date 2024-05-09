import dbConnect from "@/app/lib/mongodb";
import Usertest from "@/app/models/Usertest";
import { NextRequest,NextResponse } from "next/server";
import parseError  from "@/app/utils/errorParser";
type Params = {
  id: string;
};

export async function DELETE(req:Request,context: { params: Params }, res: NextResponse) {
  try {
    await dbConnect();
    const id = context.params.id;
    await Usertest.findByIdAndDelete(id);
    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  }
  catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 500 });
  } 
}
export async function PUT(req: Request, context: { params: { id: string } }, res: NextResponse) {
  try {
    const body = await req.json();
    await dbConnect();
    const { firstname, lastname, email, phone, password, role } = body; 
    const id = context.params.id;

    const update = {
      $set: {
        ...(firstname && { firstname }),
        ...(lastname && { lastname }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(password && { password }),
        ...(role && { role }),
      },
    };

    const updateResult = await Usertest.findByIdAndUpdate(id, update, { new: true }); 
    if (!updateResult) {
      throw new Error('User not found');
    }

    return NextResponse.json({ message: "User updated" }, { status: 200 });
  } catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }};