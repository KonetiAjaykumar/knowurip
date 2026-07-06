import { NextResponse } from "next/server";
import { sendFeedbackEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All form fields are required" }, { status: 400 });
    }

    const emailSent = await sendFeedbackEmail(name, email, message);
    if (!emailSent) {
      return NextResponse.json({ error: "Failed to dispatch review email. Please check your SMTP settings." }, { status: 500 });
    }

    return NextResponse.json({ success: "Feedback packages dispatched to mailbox konetiajaykumar0@gmail.com." });
  } catch (error) {
    console.error("Contact API route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
