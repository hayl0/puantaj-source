
const { PrismaClient } = require('@prisma/client');
const { hash, compare } = require('bcryptjs');

const prisma = new PrismaClient();

async function testAuth() {
  console.log('--- Auth Test Başlatılıyor ---');

  const email = 'admin@puantaj.com';
  const password = 'admin123';

  console.log(`Test edilen kullanıcı: ${email}`);

  try {
    // 1. Veritabanı Bağlantısı Kontrolü
    console.log('1. Veritabanına bağlanılıyor...');
    const userCount = await prisma.user.count();
    console.log(`   Veritabanı bağlantısı başarılı. Toplam kullanıcı: ${userCount}`);

    // 2. Kullanıcı Arama
    console.log('2. Kullanıcı aranıyor...');
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('   ❌ Kullanıcı bulunamadı!');
      
      // Kullanıcı oluşturma simülasyonu
      console.log('   Kullanıcı oluşturuluyor...');
      const hashedPassword = await hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          email,
          name: 'Demo Yönetici',
          password: hashedPassword,
          role: 'admin'
        }
      });
      console.log('   ✅ Kullanıcı oluşturuldu:', newUser.email);
    } else {
      console.log('   ✅ Kullanıcı bulundu:', user.email);
      console.log('   Mevcut Hash:', user.password);

      // 3. Şifre Kontrolü
      console.log('3. Şifre kontrol ediliyor...');
      const isValid = await compare(password, user.password);
      
      if (isValid) {
        console.log('   ✅ Şifre DOĞRU.');
      } else {
        console.log('   ❌ Şifre YANLIŞ.');
        
        // Şifre düzeltme simülasyonu
        console.log('   Şifre düzeltiliyor...');
        const newHashedPassword = await hash(password, 10);
        await prisma.user.update({
          where: { email },
          data: { password: newHashedPassword }
        });
        console.log('   ✅ Şifre güncellendi.');
        
        // Tekrar kontrol
        const updatedUser = await prisma.user.findUnique({ where: { email } });
        const isNowValid = await compare(password, updatedUser.password);
        console.log(`   Tekrar kontrol sonucu: ${isNowValid ? 'BAŞARILI' : 'BAŞARISIZ'}`);
      }
    }

    // --- EMPLOYEE TEST ---
    console.log('\n--- Employee (Personel) Test ---');
    const empEmail = 'user@puantaj.com';
    console.log(`Test edilen personel: ${empEmail}`);
    
    const employee = await prisma.employee.findFirst({
      where: { email: empEmail }
    });

    if (employee) {
      console.log('   ✅ Personel bulundu:', employee.name);
      
      // Şifre kontrolü
      const isPassValid = await compare('demo123', employee.password || '');
      if (!isPassValid) {
        console.log('   ❌ Personel şifresi YANLIŞ. Düzeltiliyor...');
        const hashed = await hash('demo123', 10);
        await prisma.employee.update({
            where: { id: employee.id },
            data: { password: hashed }
        });
        console.log('   ✅ Personel şifresi düzeltildi.');
      } else {
        console.log('   ✅ Personel şifresi DOĞRU.');
      }

    } else {
      console.log('   ❌ Personel bulunamadı. OLUŞTURULUYOR...');
      
      let adminUser = await prisma.user.findUnique({ where: { email: 'admin@puantaj.com' } });
      if (!adminUser) {
          console.log('   Admin bulunamadı, önce admin oluşturuluyor...');
          const adminPass = await hash('admin123', 10);
          adminUser = await prisma.user.create({
              data: { email: 'admin@puantaj.com', name: 'Demo Yönetici', password: adminPass, role: 'admin' }
          });
      }

      const empPass = await hash('demo123', 10);
      const newEmp = await prisma.employee.create({
          data: {
              email: empEmail,
              name: 'Demo Personel',
              password: empPass,
              userId: adminUser.id,
              department: 'Yazılım',
              position: 'Geliştirici',
              salary: 0,
              hireDate: new Date()
          }
      });
      console.log('   ✅ Personel oluşturuldu:', newEmp.email);
    }

  } catch (error) {
    console.error('   ❌ HATA:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();
