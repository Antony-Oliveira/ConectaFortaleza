import { defineEventHandler, readBody, createError } from "h3";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const user = (await getUserSession(event)).user; 
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: "Usuário não autenticado." });
    }

    const id = event.context.params?.id as any
    const body = await readBody(event); 

    const { titulo, descricao, tipo, categoriaId, preco, disponibilidade } = body;
    if (!titulo || !descricao || !categoriaId) {
        console.log(titulo, descricao, categoriaId);
        
      throw createError({ statusCode: 400, statusMessage: "Campos obrigatórios faltando." });
    }

    const existingService = await prisma.servico.findUnique({
      where: {id: parseInt(id)},
    });

    if (!existingService || existingService.usuarioId !== user.id) {
      throw createError({ statusCode: 403, statusMessage: "Acesso negado." });
    }

    const updatedService = await prisma.servico.update({
      where: { id: parseInt(id) },
      data: {
        titulo,
        descricao,
        tipo,
        categoriaId,
        preco: preco || null,
        disponibilidade: disponibilidade ? new Date(disponibilidade) : null,
      },
    });

    return { message: "Serviço atualizado com sucesso.", servico: updatedService };
  } catch (error) {
    console.error("Erro ao atualizar serviço:", error);
    throw createError({ statusCode: 500, statusMessage: "Erro ao atualizar serviço." });
  }
});
