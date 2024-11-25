import { User } from '#auth-utils';
import { PrismaClient } from '@prisma/client';
import { H3Error, defineEventHandler, readBody, createError } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        if (event.method !== 'POST') {
            throw createError({
                statusCode: 405,
                statusMessage: 'Método não permitido.',
            });
        }

        const { email, senha } = await readBody(event);

        if (!email || !senha) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Email e senha são obrigatórios.',
            });
        }

        const user = await prisma.usuario.findUnique({
            where: { email },
        });

        if (!user) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Credenciais inválidas. Email',
            });
        }

        const isPasswordValid = await verifyPassword(user.senha, senha);

        if (!isPasswordValid) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Credenciais inválidas. Senha',
            });
        }

        const safeUser: User = {
            id: user.id,
            nome: user.nome,
            email: user.email,
            telefone: user.telefone || undefined,
            localizacao: user.localizacao || undefined,
            bio: user.bio || undefined,
            avatarUrl: user.avatarUrl || undefined,
            criadoEm: user.criadoEm,
        };

        const session = await setUserSession(event, {
            user: safeUser,
        });

        
        console.log(session);
        return {
            success: true,
            zovo: "SIM",
            message: 'Login realizado com sucesso!',
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
            },
        };
    } catch (error) {
        console.error('Erro ao realizar login:', error);

        if (error instanceof H3Error) {
            throw error;
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Erro interno no servidor.',
        });
    }
});
