import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  
  try {
    const body = await req.json();
    const { amount, description, date, category } = body;

    if (!amount || !date) {
      return NextResponse.json({ error: "Amount and Date are required" }, { status: 400 });
    }

    const income = await prisma.income.create({
      data: {
        amount: parseFloat(amount),
        description,
        date: new Date(date),
        category,
        userId
      }
    });

    return NextResponse.json(income);
  } catch (error) {
    console.error("Error creating income:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
