import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST() {
  try {
    await clearSessionCookie();
    return NextResponse.json({ success: "Session terminated successfully." });
  } catch (error) {
    console.error("Logout route error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
