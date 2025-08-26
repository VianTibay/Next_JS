import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();




export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

const users = await prisma.user.findMany();

const user = await prisma.user.findUnique({ where: { email } });
if(users.length === 0 ){
return NextResponse.json({error:"No users found in database. Please sign up first."},{status:404})
} 




    if (!user) {
      return NextResponse.json(
        { error: "Invalid Email" }, 
        { status: 404 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid Password" }, { status: 401 });
    }




    return NextResponse.json({ message: "Login successful", user });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
