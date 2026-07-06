import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken, setSessionCookie } from "@/lib/auth";
import { sendOTPEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email, password, rememberMe } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing login credentials" }, { status: 400 });
    }

    // Retrieve user record
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid email address or password" }, { status: 401 });
    }

    // Verify password matching
    const passwordsMatch = await comparePassword(password, user.passwordHash);
    if (!passwordsMatch) {
      return NextResponse.json({ error: "Invalid email address or password" }, { status: 401 });
    }

    // Redirect to verification if user registration was never verified
    if (!user.isVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await prisma.verificationOTP.upsert({
        where: { email },
        update: {
          otp,
          expiresAt,
          attempts: 0,
        },
        create: {
          email,
          otp,
          expiresAt,
          attempts: 0,
        },
      });

      await sendOTPEmail(email, otp);

      return NextResponse.json({ 
        status: "VERIFY_REQUIRED", 
        email, 
        message: "Email verification required. OTP sent." 
      });
    }

    // Setup active session
    const token = signToken({ userId: user.id, email: user.email }, !!rememberMe);
    await setSessionCookie(token, !!rememberMe);

    return NextResponse.json({ 
      success: "Authentication handshake successful.",
      user: { id: user.id, fullName: user.fullName, email: user.email, avatar: user.avatar }
    });
  } catch (error: any) {
    console.error("Login route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
