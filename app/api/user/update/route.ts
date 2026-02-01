import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const userRole = (session.user as any).role;
  
  try {
    const body = await req.json();
    const { name, companyName, taxNumber, address, phone } = body;

    let updatedUser;

    if (userRole === 'personnel') {
      // Personnel can only update their own basic info (name, maybe phone if we add it to Employee)
      // For now, just update name.
      updatedUser = await prisma.employee.update({
        where: { id: userId },
        data: {
          name: name || undefined,
          // Employee model doesn't have company/address fields usually
        },
      });
      
      // Return consistent structure
      updatedUser = {
        ...updatedUser,
        role: 'personnel'
      };
    } else {
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name: name || undefined,
          companyName: companyName || undefined,
          taxNumber: taxNumber || undefined,
          address: address || undefined,
          phone: phone || undefined,
        },
      });
    }

    return NextResponse.json({ 
      success: true, 
      user: updatedUser 
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
