import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      version: process.env.NEXT_PUBLIC_APP_VERSION || "v0.0.0",
      commit: process.env.NEXT_PUBLIC_COMMIT_SHA || "unknown",
      branch: process.env.NEXT_PUBLIC_BRANCH_NAME || "unknown",
      buildDate: process.env.NEXT_PUBLIC_APP_BUILD_DATE || "unknown",
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
