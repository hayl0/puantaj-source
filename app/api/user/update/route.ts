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
    const { name, companyName, taxNumber, address, phone, image } = body;

    let updatedUser;

    if (userRole === 'personnel') {
      // Personnel can only update their own basic info
      updatedUser = await prisma.employee.update({
        where: { id: userId },
        data: {
          name: name || undefined,
          phone: phone || undefined,
          address: address || undefined,
          image: image || undefined,
        },
      });
      
      // Return consistent structure
      updatedUser = {
        ...updatedUser,
        role: 'personnel',
        // Ensure fields are returned even if not updated
        phone: updatedUser.phone || '',
        address: updatedUser.address || '',
        image: updatedUser.image || null
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
          image: image || undefined,
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
