import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { startOfMonth, subMonths, format, endOfMonth } from "date-fns";
import { tr } from "date-fns/locale";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  
  try {
    // 1. Calculate Monthly Expense (Current Month)
    const employees = await prisma.employee.findMany({
      where: { userId },
      select: { salary: true, paymentType: true, department: true }
    });

    let currentMonthlyExpense = 0;
    const departmentExpenses: Record<string, number> = {};

    employees.forEach(emp => {
      let monthlyCost = 0;
      if (emp.paymentType === 'monthly') {
        monthlyCost = emp.salary;
      } else if (emp.paymentType === 'hourly') {
        monthlyCost = emp.salary * 160; // Approx 160 hours/month
      } else if (emp.paymentType === 'daily') {
        monthlyCost = emp.salary * 22; // Approx 22 days/month
      }
      
      currentMonthlyExpense += monthlyCost;
      
      const dept = emp.department || 'Diğer';
      departmentExpenses[dept] = (departmentExpenses[dept] || 0) + monthlyCost;
    });

    // 2. Generate Chart Data (Last 6 Months)
    const incomeData = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = subMonths(today, i);
      const monthName = format(date, 'MMM', { locale: tr });
      
      // Simulate historical data based on current expense + random variation
      // In a real app, this would query historical Payroll records
      const variation = (Math.random() * 0.2) - 0.1; // +/- 10%
      const expense = Math.round(currentMonthlyExpense * (1 + variation));
      
      // Simulate Income (e.g., Project Budget allocation)
      // Usually higher than expense for a profitable company
      const income = Math.round(expense * 1.35); 

      incomeData.push({
        month: monthName,
        income,
        expense
      });
    }

    // 3. Expense Categories (by Department)
    // Convert departmentExpenses map to array
    const expenseCategories = Object.entries(departmentExpenses)
      .map(([name, value], index) => {
        const colors = ['#8b5cf6', '#f43f5e', '#0ea5e9', '#f59e0b', '#10b981', '#6366f1'];
        return {
          name,
          value: Math.round((value / currentMonthlyExpense) * 100), // Percentage
          amount: value,
          color: colors[index % colors.length]
        };
      })
      .sort((a, b) => b.value - a.value); // Sort by highest expense

    // 4. Summary Stats
    const totalYearlyExpense = currentMonthlyExpense * 12; // Projected
    const totalYearlyIncome = totalYearlyExpense * 1.4;
    const netProfit = totalYearlyIncome - totalYearlyExpense;

    return NextResponse.json({
      incomeData,
      expenseCategories,
      summary: {
        totalNetProfit: netProfit,
        monthlyIncome: Math.round(currentMonthlyExpense * 1.35),
        monthlyExpense: currentMonthlyExpense,
        yearlyGrowth: 24.5 // Mock growth
      }
    });

  } catch (error) {
    console.error("Finance Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
