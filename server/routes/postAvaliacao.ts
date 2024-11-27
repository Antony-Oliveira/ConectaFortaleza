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

    const { servicoId, nota, comentario } = body;

    if (!servicoId || nota === undefined || !comentario) {
      throw createError({ statusCode: 400, statusMessage: "Campos obrigatórios faltando." });
    }

    const novaAvaliacao = await prisma.avaliacao.create({
      data: {
        servicoId,
        usuarioId: user.id,
        nota,
        comentario,
      },
      include: {usuario: true}
    });

    return { success: true, novaAvaliacao };
  } catch (error) {
    console.error("Erro ao enviar avaliação:", error);
    throw createError({ statusCode: 500, statusMessage: "Erro ao enviar avaliação." });
  }
});
