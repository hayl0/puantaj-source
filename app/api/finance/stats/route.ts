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

    // Fetch actual payroll history
    const historicalPayrolls = await prisma.payroll.groupBy({
      by: ['month'],
      where: {
        userId,
        month: {
          gte: format(subMonths(today, 5), 'yyyy-MM')
        }
      },
      _sum: {
        amount: true
      }
    });

    // Fetch actual income history
    const historicalIncomes = await prisma.income.groupBy({
        by: ['date'],
        where: {
            userId,
            date: {
                gte: startOfMonth(subMonths(today, 5))
            }
        },
        _sum: {
            amount: true
        }
    });

    // Create maps for easy lookup
    const payrollMap = new Map(historicalPayrolls.map(p => [p.month, p._sum.amount || 0]));
    
    // Aggregate income by month
    const incomeMap = new Map<string, number>();
    // Since groupBy returns dates, we need to process them into months
    // Ideally we would group by month in SQL, but Prisma groupBy date is specific.
    // So we fetch all and aggregate here or use raw query. 
    // For now, let's just use findMany if we want precise date handling or stick to groupBy if we can group by formatted string (Prisma doesn't support format in groupBy).
    // Let's use findMany for simplicity and aggregation in JS for now as data volume is likely low.
    
    const incomes = await prisma.income.findMany({
        where: {
            userId,
            date: {
                gte: startOfMonth(subMonths(today, 5))
            }
        }
    });

    incomes.forEach((inc: any) => {
        const m = format(inc.date, 'yyyy-MM');
        incomeMap.set(m, (incomeMap.get(m) || 0) + inc.amount);
    });

    for (let i = 5; i >= 0; i--) {
      const date = subMonths(today, i);
      const monthKey = format(date, 'yyyy-MM');
      const monthName = format(date, 'MMM', { locale: tr });
      
      // Use actual payroll data if available, otherwise 0
      const expense = payrollMap.get(monthKey) || 0;
      
      // Use actual income data
      const income = incomeMap.get(monthKey) || 0;

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
          value: Math.round((value / currentMonthlyExpense) * 100) || 0, // Percentage
          amount: value,
          color: colors[index % colors.length]
        };
      })
      .sort((a, b) => b.value - a.value); // Sort by highest expense

    // 4. Summary Stats
    // Annualized run rate based on current employees
    const totalYearlyExpense = currentMonthlyExpense * 12; 
    
    // Calculate total income from the last 12 months (or similar period)
    const yearlyIncomes = await prisma.income.aggregate({
        where: {
            userId,
            date: {
                gte: subMonths(today, 12)
            }
        },
        _sum: {
            amount: true
        }
    });
    
    const totalYearlyIncome = yearlyIncomes._sum.amount || 0;
    const netProfit = totalYearlyIncome - totalYearlyExpense;

    return NextResponse.json({
      incomeData,
      expenseCategories,
      summary: {
        totalNetProfit: netProfit,
        monthlyIncome: 0,
        monthlyExpense: currentMonthlyExpense,
        yearlyGrowth: 0 // Cannot calculate without historical revenue
      }
    });

  } catch (error) {
    console.error("Finance Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
