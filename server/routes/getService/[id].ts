import { PrismaClient } from "@prisma/client";


export default defineEventHandler(async (event) => {
  const { id } = await event.context.params as any;
  const prisma = new PrismaClient();

  const servico = await prisma.servico.findUnique({
    where: { id: parseInt(id) },
    include: {usuario: true, avaliacoes: true, categoria: true}

  }); 
  console.log(await servico);
  return {servico};
})
