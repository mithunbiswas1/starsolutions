import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Logicraft Next.js Full Stack Backend Server is running successfully!",
    status: 200,
  });
}
