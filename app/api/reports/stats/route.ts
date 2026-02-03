import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { startOfMonth, endOfMonth } from "date-fns";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  
  try {
    // 1. Total Reports (Payrolls Generated)
    const totalReports = await prisma.payroll.count({
      where: { userId }
    });

    // 2. Monthly Downloads (Payrolls this month)
    const now = new Date();
    const monthlyDownloads = await prisma.payroll.count({
      where: { 
        userId,
        generatedAt: {
          gte: startOfMonth(now),
          lte: endOfMonth(now)
        }
      }
    });

    // 3. Data Size (Approximate)
    // Assume each report is ~150KB
    const sizeInKB = totalReports * 150;
    const sizeFormatted = sizeInKB > 1024 
      ? `${(sizeInKB / 1024).toFixed(1)}MB` 
      : `${sizeInKB}KB`;

    // 4. Most Popular (Mock for now, or based on access logs if we had them)
    // We'll stick to "Maaş Bordrosu" as it's the main report type
    
    return NextResponse.json({
      totalReports,
      monthlyDownloads,
      dataSize: sizeFormatted,
      mostPopular: "Maaş Bordrosu",
      growth: 18 // Mock growth percentage
    });

  } catch (error) {
    console.error("Reports Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
