import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      username: 'mlapada',
      email: 'mlapada@mail.com',
      password: 'mlapada',
    },
  });

  const accounts = await prisma.account.createMany({
    data: [
      { name: 'Savings', amount: 50000, userId: 1 },
      { name: 'Emergency Funds', amount: 150000, userId: 1 },
    ],
  });

  const categories = await prisma.category.createMany({
    data: [
      { name: 'Food', userId: 1 },
      { name: 'Bills', userId: 1 },
    ],
  });

  const subcategories = await prisma.subcategory.createMany({
    data: [
      { name: 'Breakfast', categoryId: 1, userId: 1 },
      { name: 'Lunch', categoryId: 1, userId: 1 },
    ],
  });

  console.log({ user, categories, subcategories });
}
