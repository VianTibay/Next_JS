import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, password } = body;

    // ✅ Action: List all users
    if (action === "list") {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });

      if (!users || users.length === 0) {
        return NextResponse.json({ message: "No users found" }, { status: 200 });
      }

      return NextResponse.json(users, { status: 200 });
    }

    // ✅ Action: Create new user (signup)
    if (action === "create") {
      if (!email || !password) {
        return NextResponse.json(
          { error: "Email and password required" },
          { status: 400 }
        );
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 }
        );
      }

      if (!email.endsWith("@gmail.com")) {
        return NextResponse.json(
          { error: "Email must be a valid gmail address (example@gmail.com)" },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: { email, password: hashedPassword },
        select: { id: true, email: true, createdAt: true },
      });

      return NextResponse.json(
        { message: "User created", user },
        { status: 201 }
      );
    }

    // ❌ Invalid action
    return NextResponse.json(
      { error: "Invalid action. Use 'list' or 'create'." },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
