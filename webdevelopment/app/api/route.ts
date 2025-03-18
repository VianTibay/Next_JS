// pages/api/resource/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(
      { message: "Resource retrieved successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Error retrieving resources", error: error.message },
      { status: 500 }
    );
  }
}