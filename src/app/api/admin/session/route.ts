import { NextRequest, NextResponse } from "next/server";

import { verifySessionToken } from "@/src/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("admin_session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false });
    }

    const sessionData = verifySessionToken(sessionCookie);

    if (!sessionData) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      username: sessionData.username,
    });
  } catch (error) {
    console.error("Error in session check API:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi kiểm tra phiên làm việc" },
      { status: 500 }
    );
  }
}
