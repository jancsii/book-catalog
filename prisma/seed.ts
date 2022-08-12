import { PrismaClient } from '@prisma/client';
import { books } from './../data/books';
import { authors } from './../data/authors';

const prisma = new PrismaClient();

async function main() {
  await prisma.author.createMany({ data: authors });

  await prisma.book.createMany({ data: books });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
