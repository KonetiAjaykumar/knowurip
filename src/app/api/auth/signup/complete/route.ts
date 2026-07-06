import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { fullName, email, password, otp } = await request.json();

    if (!fullName || !email || !password || !otp) {
      return NextResponse.json({ error: "Missing registration parameters" }, { status: 400 });
    }

    // Re-verify verification state
    const verificationRecord = await prisma.verificationOTP.findUnique({
      where: { email },
    });

    if (!verificationRecord || verificationRecord.otp !== otp) {
      return NextResponse.json({ error: "Verification state is invalid or has expired." }, { status: 400 });
    }

    if (new Date() > new Date(verificationRecord.expiresAt)) {
      return NextResponse.json({ error: "Verification code expired. Please request a new one." }, { status: 400 });
    }

    // Hash user password
    const passwordHash = await hashPassword(password);

    // Create user in database (upsert if they failed validation/creation earlier but did sign up)
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        fullName,
        passwordHash,
        isVerified: true,
      },
      create: {
        fullName,
        email,
        passwordHash,
        isVerified: true,
      },
    });

    // Delete verification record
    await prisma.verificationOTP.delete({
      where: { email },
    });

    // Auto-login: Sign JWT Token & set HTTP-only cookie
    const token = signToken({ userId: user.id, email: user.email }, false);
    await setSessionCookie(token, false);

    return NextResponse.json({ 
      success: "Account registration completed.", 
      user: { id: user.id, fullName: user.fullName, email: user.email } 
    });
  } catch (error: any) {
    console.error("Signup complete route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
