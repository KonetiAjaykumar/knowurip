import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOTPEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { fullName, email } = await request.json();

    if (!fullName || !email) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Check if email already registered and verified
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.isVerified) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
    }

    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

    // Check resend limits on existing OTP record
    const existingOTP = await prisma.verificationOTP.findUnique({
      where: { email },
    });

    if (existingOTP) {
      const timeSinceLastResend = Date.now() - new Date(existingOTP.updatedAt).getTime();
      
      // Enforce 60 seconds throttle
      if (timeSinceLastResend < 60 * 1000) {
        const secondsLeft = Math.ceil((60 * 1000 - timeSinceLastResend) / 1000);
        return NextResponse.json({ error: `Please wait ${secondsLeft}s before requesting a new OTP.` }, { status: 429 });
      }

      // Enforce max 5 resends limit
      if (existingOTP.resends >= 5) {
        return NextResponse.json({ error: "Maximum resends limit (5) reached. Please try again later." }, { status: 400 });
      }

      // Update existing record
      await prisma.verificationOTP.update({
        where: { email },
        data: {
          otp,
          expiresAt,
          resends: existingOTP.resends + 1,
          attempts: 0, // Reset attempts on resend
        },
      });
    } else {
      // Create new OTP record
      await prisma.verificationOTP.create({
        data: {
          email,
          otp,
          expiresAt,
          resends: 1,
          attempts: 0,
        },
      });
    }

    // Send SMTP email
    const emailSent = await sendOTPEmail(email, otp);
    if (!emailSent) {
      return NextResponse.json({ error: "Failed to dispatch verification email. Please check your SMTP settings." }, { status: 500 });
    }

    return NextResponse.json({ success: "OTP verification code dispatched." });
  } catch (error: any) {
    console.error("Signup init route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
