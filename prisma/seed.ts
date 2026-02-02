import { PrismaClient } from '@prisma/client';
import { fakerTR as faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create Admin User (if not exists)
  const adminEmail = 'admin@puantajpro.com';
  const hashedPassword = await bcrypt.hash('123456', 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Halil Admin',
      password: hashedPassword,
      role: 'admin',
      companyName: 'Puantaj Pro Teknoloji A.Ş.',
      emailVerified: new Date(),
      plan: 'pro',
    },
  });

  console.log(`👤 Admin user ready: ${admin.email}`);

  // 2. Create Employees
  const departments = ['Yazılım', 'İnsan Kaynakları', 'Satış', 'Pazarlama', 'Muhasebe'];
  const positions = ['Uzman', 'Kıdemli Uzman', 'Yönetici', 'Asistan', 'Direktör'];
  const paymentTypes = ['monthly', 'hourly', 'daily'];

  console.log('👥 Creating employees...');
  
  // Create 15 random employees
  const employees = [];
  for (let i = 0; i < 15; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    
    const employee = await prisma.employee.create({
      data: {
        userId: admin.id,
        name: `${firstName} ${lastName}`,
        email: email,
        department: faker.helpers.arrayElement(departments),
        position: faker.helpers.arrayElement(positions),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        salary: parseFloat(faker.finance.amount({ min: 25000, max: 85000, dec: 0 })),
        paymentType: faker.helpers.arrayElement(paymentTypes),
        hireDate: faker.date.past({ years: 3 }),
        emailVerified: new Date(),
        image: faker.image.avatar(),
      },
    });
    employees.push(employee);
  }

  console.log(`✅ Created ${employees.length} employees.`);

  // 3. Create Shifts for current month
  console.log('📅 Creating shifts...');
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const shiftTypes = ['morning', 'evening', 'night', 'full'];
  const shiftTitles = {
    morning: 'Sabah Vardiyası',
    evening: 'Akşam Vardiyası',
    night: 'Gece Vardiyası',
    full: 'Tam Gün',
  };

  for (const emp of employees) {
    // Generate 10-20 shifts per employee
    const numShifts = faker.number.int({ min: 10, max: 20 });
    
    for (let i = 0; i < numShifts; i++) {
      const shiftDate = faker.date.between({ from: startOfMonth, to: endOfMonth });
      const type = faker.helpers.arrayElement(shiftTypes) as keyof typeof shiftTitles;
      
      // Set hours based on type
      const start = new Date(shiftDate);
      const end = new Date(shiftDate);
      
      if (type === 'morning') {
        start.setHours(8, 0, 0);
        end.setHours(16, 0, 0);
      } else if (type === 'evening') {
        start.setHours(16, 0, 0);
        end.setHours(24, 0, 0);
      } else if (type === 'night') {
        start.setHours(0, 0, 0);
        end.setHours(8, 0, 0);
      } else {
        start.setHours(9, 0, 0);
        end.setHours(18, 0, 0);
      }

      await prisma.shift.create({
        data: {
          userId: admin.id,
          employeeId: emp.id,
          title: shiftTitles[type],
          type: type,
          start: start,
          end: end,
        },
      });
    }
  }

  // 4. Create Leaves
  console.log('🏖️ Creating leaves...');
  const leaveTypes = ['Yıllık İzin', 'Hastalık İzni', 'Mazeret İzni'];
  const leaveStatuses = ['approved', 'pending', 'rejected'];

  for (const emp of employees) {
    if (faker.datatype.boolean(0.3)) { // 30% chance of having a leave
      const startDate = faker.date.recent({ days: 30 });
      const days = faker.number.int({ min: 1, max: 5 });
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + days);

      await prisma.leave.create({
        data: {
          userId: admin.id,
          employeeId: emp.id,
          type: faker.helpers.arrayElement(leaveTypes),
          startDate: startDate,
          endDate: endDate,
          days: days,
          status: faker.helpers.arrayElement(leaveStatuses),
          reason: faker.lorem.sentence(),
        },
      });
    }
  }

  // 5. Create Attendance Records (Puantaj)
  console.log('⏱️ Creating attendance records...');
  const statuses = ['present', 'absent', 'late', 'leave', 'holiday'];
  
  // Last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    for (const emp of employees) {
      const status = faker.helpers.weightedArrayElement([
        { weight: 80, value: 'present' },
        { weight: 5, value: 'absent' },
        { weight: 10, value: 'late' },
        { weight: 5, value: 'leave' },
      ]);

      let checkIn = null;
      let checkOut = null;
      let hours = 0;

      if (status === 'present' || status === 'late') {
        checkIn = new Date(date);
        checkOut = new Date(date);
        
        if (status === 'present') {
          checkIn.setHours(9, faker.number.int({ min: 0, max: 10 })); // 09:00 - 09:10
        } else {
          checkIn.setHours(9, faker.number.int({ min: 15, max: 45 })); // 09:15 - 09:45
        }
        
        checkOut.setHours(18, faker.number.int({ min: 0, max: 30 })); // 18:00 - 18:30
        hours = 9;
      }

      await prisma.attendance.create({
        data: {
          userId: admin.id,
          employeeId: emp.id,
          date: date,
          status: status,
          checkIn: checkIn,
          checkOut: checkOut,
          hours: hours,
        },
      });
    }
  }

  console.log('✨ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
