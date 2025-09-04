import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";
import {v4 as uuidv4} from "uuid";


const prisma = new PrismaClient();


export async function GET(req: Request) {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}



export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;
  
    const apiKey = uuidv4();




    if (!email || !password) {
      return NextResponse.json(
        { error: "Please provide both email and password." },
        { status: 400 }
      );
    }

    // Check kung existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Validation ng email
    if (!email.endsWith("@gmail.com")) {
      return NextResponse.json(
        { error: "Email must be a valid gmail address (example@gmail.com)" },
        { status: 400 }
      );
    }



    // Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: { 
        email, 
        password,
        api: apiKey
      
      },
      select: { 
        id: true,
         email: true,
         createdAt: true,
         api: true
        },
    });




return NextResponse.json(user);
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
