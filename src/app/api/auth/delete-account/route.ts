import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, clearSessionCookie } from "@/lib/auth";

export async function POST() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized session" }, { status: 401 });
    }

    // Delete user from database
    await prisma.user.delete({
      where: { id: session.userId },
    });

    // Clear session cookies
    await clearSessionCookie();

    return NextResponse.json({ success: "Account has been permanently deleted." });
  } catch (error: any) {
    console.error("Delete account route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
