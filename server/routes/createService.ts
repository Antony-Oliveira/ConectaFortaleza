import { defineEventHandler, readBody, createError } from "h3";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const user = (await getUserSession(event)).user;
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: "Usuário não autenticado." });
    }

    const body = await readBody(event);

    const { titulo, descricao, tipo, categoriaId, preco, disponibilidade } = body;
    
    if (!titulo || !descricao || !categoriaId) {
        []
      throw createError({ statusCode: 400, statusMessage: "Campos obrigatórios faltando.", });
    }

    const newService = await prisma.servico.create({
      data: {
        titulo,
        descricao,
        tipo,
        categoriaId,
        preco: preco || null,
        disponibilidade: disponibilidade ? new Date(disponibilidade) : null,
        usuarioId: user.id,
      },
    });

    return { message: "Serviço criado com sucesso.", servico: newService };
  } catch (error) {
    console.error("Erro ao criar serviço:", error);
    throw createError({ statusCode: 500, statusMessage: "Erro ao criar serviço." });
  }
});
