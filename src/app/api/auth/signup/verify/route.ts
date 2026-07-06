import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const verificationRecord = await prisma.verificationOTP.findUnique({
      where: { email },
    });

    if (!verificationRecord) {
      return NextResponse.json({ error: "Verification record not found. Please sign up again." }, { status: 404 });
    }

    // Check expiration
    if (new Date() > new Date(verificationRecord.expiresAt)) {
      return NextResponse.json({ error: "Verification code expired. Please request a new one." }, { status: 400 });
    }

    // Check attempt limits
    if (verificationRecord.attempts >= 5) {
      return NextResponse.json({ error: "Maximum attempts exceeded. Please initiate a new signup." }, { status: 400 });
    }

    // Increment attempts
    await prisma.verificationOTP.update({
      where: { email },
      data: {
        attempts: verificationRecord.attempts + 1,
      },
    });

    // Check if OTP matches
    if (verificationRecord.otp !== otp) {
      const attemptsLeft = 5 - (verificationRecord.attempts + 1);
      return NextResponse.json({ 
        error: `Incorrect verification code. ${attemptsLeft} attempts remaining.` 
      }, { status: 400 });
    }

    return NextResponse.json({ success: "OTP verified successfully. Proceed to password configuration." });
  } catch (error: any) {
    console.error("Signup verify route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
