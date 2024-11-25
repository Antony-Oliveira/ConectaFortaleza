import { defineEventHandler } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const categories = await prisma.categoria.findMany({
      select: {
        id: true,
        nome: true,
      },
    });

    return { categories }; 
  } catch (error) {
    console.error("Erro ao carregar categorias:", error);
    return { categories: [] }; 
  }
});
