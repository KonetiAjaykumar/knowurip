import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, hashPassword, comparePassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized session" }, { status: 401 });
    }

    const { fullName, avatar, currentPassword, newPassword } = await request.json();

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: any = {};

    if (fullName) {
      updateData.fullName = fullName;
    }

    if (avatar) {
      updateData.avatar = avatar;
    }

    // Handle password change request
    if (currentPassword && newPassword) {
      const passwordsMatch = await comparePassword(currentPassword, user.passwordHash);
      if (!passwordsMatch) {
        return NextResponse.json({ error: "Current password input is incorrect." }, { status: 400 });
      }
      updateData.passwordHash = await hashPassword(newPassword);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No update parameters provided" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        avatar: true,
      },
    });

    return NextResponse.json({ success: "Profile details updated successfully.", user: updatedUser });
  } catch (error: any) {
    console.error("Update profile route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
