import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetRecord) {
      return NextResponse.json({ error: "Invalid or expired password reset token." }, { status: 400 });
    }

    // Check expiration status
    if (new Date() > new Date(resetRecord.expiresAt)) {
      await prisma.passwordReset.delete({ where: { token } });
      return NextResponse.json({ error: "Reset link has expired. Please initiate a new recovery." }, { status: 400 });
    }

    // Hash the new password
    const passwordHash = await hashPassword(password);

    // Update user profile and purge token
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash },
      }),
      prisma.passwordReset.delete({
        where: { token },
      }),
    ]);

    return NextResponse.json({ success: "Password reset successful. You may now sign in." });
  } catch (error: any) {
    console.error("Reset password route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
