import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // Kunin lahat ng users sa database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        password: true,
        createdAt: true
        // wag mo isama yung password para safe
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }
    if (!email.endsWith("@gmail.com")) {
      return NextResponse.json({ error: "Email must be a valid gmail address example @gmail.com" }, { status: 400 });
     }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return NextResponse.json({ message: "User created", user });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
  