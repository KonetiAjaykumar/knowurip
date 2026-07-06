import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email address" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Mock success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ success: "If the email exists, a reset link will be dispatched shortly." });
    }

    // Generate secure random token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour validity

    // Remove any active resets for this user
    await prisma.passwordReset.deleteMany({
      where: { userId: user.id },
    });

    // Save reset token details
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // Send SMTP email
    const emailSent = await sendPasswordResetEmail(email, token);
    if (!emailSent) {
      return NextResponse.json({ error: "Failed to dispatch password reset email." }, { status: 500 });
    }

    return NextResponse.json({ success: "Password override token dispatched to your mailbox." });
  } catch (error: any) {
    console.error("Forgot password route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
