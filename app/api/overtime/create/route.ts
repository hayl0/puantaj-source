import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const { employeeId, date, startTime, endTime, description } = await req.json();

    if (!employeeId || !date || !startTime || !endTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Combine date and time to create DateTime objects
    // date is YYYY-MM-DD
    // startTime is HH:MM
    const startDateTime = new Date(`${date}T${startTime}:00`);
    const endDateTime = new Date(`${date}T${endTime}:00`);

    // Handle overnight shifts (if end time is before start time, assume next day)
    if (endDateTime < startDateTime) {
      endDateTime.setDate(endDateTime.getDate() + 1);
    }

    const shift = await prisma.shift.create({
      data: {
        userId,
        employeeId,
        title: description || "Fazla Mesai",
        start: startDateTime,
        end: endDateTime,
        type: "overtime",
      },
    });

    return NextResponse.json(shift);
  } catch (error) {
    console.error("Error creating overtime request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
