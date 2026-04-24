import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Check if admin user exists
  const existingAdmin = await prisma.user.findUnique({
    where: { username: 'root' },
  });

  if (!existingAdmin) {
    // Create default admin user
    const hashedPassword = await bcrypt.hash('root', 10);
    await prisma.user.create({
      data: {
        username: 'root',
        password: hashedPassword,
        name: 'Administrator',
        role: 'ADMIN',
        isActive: true,
      },
    });
    console.log('Default admin user created: root / root');
  } else {
    console.log('Admin user already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
