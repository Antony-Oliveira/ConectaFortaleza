import { PrismaClient } from "@prisma/client";


export default defineEventHandler(async (event) => {
  const { id } =  event.context.params as any;
  const prisma = new PrismaClient();

  const servico = await prisma.servico.findUnique({
    where: { id: parseInt(id) },
    include: {usuario: true, avaliacoes: {include: {usuario: true}}, categoria: true}

  }); 
  console.log(await servico);
  return {servico};
})
