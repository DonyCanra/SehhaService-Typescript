import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash the password
  const hashedPassword = await bcrypt.hash('donycanra10', 10);

  // Create sample users
  await prisma.user.create({
    data: {
      email: 'donicanrarofikar@gmail.com',
      username: 'DonyCanra',
      password: hashedPassword,
    },
  });

  // Add more users as needed
  console.log('Seeding completed');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
