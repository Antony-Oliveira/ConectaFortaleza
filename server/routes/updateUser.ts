import { PrismaClient } from "@prisma/client";
import { User } from "#auth-utils";
import { isAuthed } from "../../helpers/auth";

export default defineEventHandler(async (event) => {
    await isAuthed(event);
    const prisma = new PrismaClient();
    const userId = (await getUserSession(event)).user!.id;
    const body = await readBody(event); 

    try {
        const updatedUser = await prisma.usuario.update({
            where: { id: userId },
            data: body,
        });

        const safeUser: User = {
            ...updatedUser,
            senha: undefined,
            telefone: updatedUser.telefone || undefined,
            localizacao: updatedUser.localizacao || undefined,
            bio: updatedUser.bio || undefined,
            avatarUrl: updatedUser.avatarUrl || undefined,
        };

        await replaceUserSession(event, {
            user: safeUser, 
        });

        return { message: "Usuário atualizado com sucesso", user: safeUser };
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        throw createError({ statusCode: 500, statusMessage: "Erro ao atualizar usuário" });
    }
});
