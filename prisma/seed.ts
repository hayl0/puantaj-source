
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await hash('admin123', 12);
  const userPassword = await hash('demo123', 12);

  // Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@puantaj.com' },
    update: {
      password: password,
      role: 'admin',
      name: 'Yönetici'
    },
    create: {
      email: 'admin@puantaj.com',
      name: 'Yönetici',
      password: password,
      role: 'admin',
    },
  });

  // Regular User
  const user = await prisma.user.upsert({
    where: { email: 'user@puantaj.com' },
    update: {
      password: userPassword,
      role: 'user',
      name: 'Demo Kullanıcı'
    },
    create: {
      email: 'user@puantaj.com',
      name: 'Demo Kullanıcı',
      password: userPassword,
      role: 'user',
    },
  });

  console.log({ admin, user });

  // Create some sample employees for the admin
  const employees = [
    { name: 'Ahmet Yılmaz', department: 'Yazılım', position: 'Frontend Developer', salary: 35000 },
    { name: 'Ayşe Demir', department: 'Tasarım', position: 'UI/UX Designer', salary: 32000 },
    { name: 'Mehmet Kaya', department: 'Yazılım', position: 'Backend Developer', salary: 38000 },
    { name: 'Zeynep Çelik', department: 'İK', position: 'İK Uzmanı', salary: 28000 },
    { name: 'Can Yıldız', department: 'Pazarlama', position: 'Marketing Lead', salary: 40000 },
  ];

  for (const emp of employees) {
    await prisma.employee.create({
      data: {
        ...emp,
        email: `${emp.name.toLowerCase().replace(' ', '.')}@puantaj.com`,
        hireDate: new Date(),
        userId: admin.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
