import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Đăng xuất thành công",
    });

    // Delete cookie by setting maxAge to 0
    response.cookies.set({
      name: "admin_session",
      value: "",
      httpOnly: true,
      path: "/",
      maxAge: 0,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Error in logout API:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống trong quá trình đăng xuất" },
      { status: 500 }
    );
  }
}
