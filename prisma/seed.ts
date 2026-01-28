import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10); 
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@medistore.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@medistore.com',
      password: adminPassword,
      role: Role.ADMIN, 
      address: 'Headquarters, Dhaka',
    },
  });

  console.log(`✅ Admin created: ${admin.email}`);

  // 2. Create some Categories (Optional)
  const categories = ['Tablet', 'Syrup', 'Injection', 'Supplements'];
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat },
      update: {},
      create: { name: cat },
    });
  }
  console.log('✅ Categories created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });