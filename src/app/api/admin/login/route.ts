import { NextRequest, NextResponse } from "next/server";

import { hashPassword, createSessionToken } from "@/src/lib/auth";

const ADMIN_USERNAME = "admin";
// SHA-256 hash of "loc123@@"
const ADMIN_PASSWORD_HASH = "f0e1d03486839fc5047e91376fa023d1c3b7da90c7bb98db09dbf705e0b5fde5";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Tên đăng nhập và mật khẩu là bắt buộc" },
        { status: 400 }
      );
    }

    const inputHash = hashPassword(password);

    if (username === ADMIN_USERNAME && inputHash === ADMIN_PASSWORD_HASH) {
      const token = createSessionToken(username);
      const response = NextResponse.json({
        success: true,
        message: "Đăng nhập thành công",
      });

      // Set HttpOnly cookie
      response.cookies.set({
        name: "admin_session",
        value: token,
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours in seconds
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      return response;
    }

    return NextResponse.json(
      { error: "Tên đăng nhập hoặc mật khẩu không chính xác" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Error in login API:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống trong quá trình đăng nhập" },
      { status: 500 }
    );
  }
}
