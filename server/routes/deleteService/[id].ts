import { defineEventHandler, createError } from "h3";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const user = (await getUserSession(event)).user;
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: "Usuário não autenticado." });
    }

    const { id } = event.context.params as any; 

    const service = await prisma.servico.findUnique({
      where: { id: parseInt(id), }, 
    });


    if (service == null || service.usuarioId !== user.id) {
      console.log(service?.usuarioId, user.id);
      return { message: "Serviço não encontrado." };
    }

    await prisma.servico.delete({
      where: { id: parseInt(id) }, 
    });

    return { message: "Serviço excluído com sucesso." };
  } catch (error) {
    console.error("Erro ao excluir serviço:", error);
    throw createError({ statusCode: 500, statusMessage: "Erro ao excluir serviço." });
  }
});
