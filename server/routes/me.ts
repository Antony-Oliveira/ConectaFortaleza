import { User } from "#auth-utils";
import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();
  const {id} = await readBody(event);
  if (event.method !== "POST") {
    throw createError({
      statusCode: 405,
      message: "Método não permitido. Apenas GET é aceito.",
    });
  }




  try {
    const user = await prisma.usuario.findUnique({
      where: { id: id},
      include: {
        servicos: true,
        avaliacoes: true,
      },
    });

    if (!user) {
      throw createError({ statusCode: 404, message: "Usuário não encontrado" });
    }

    return { user };
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    throw createError({ statusCode: 500, message: "Erro interno no servidor" });
  }
});
