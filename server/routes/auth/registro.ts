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
        const { nome, email, senha, telefone, localizacao } = await readBody(event);

        if (!nome || !email || !senha) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Nome, email e senha são obrigatórios.',
            });
        }

        const existingUser = await prisma.usuario.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Este email já está registrado.',
            });
        }

        const hashedPassword = await hashPassword(senha);

        const newUser = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: hashedPassword,
                telefone: telefone || undefined,
                localizacao: localizacao || undefined,
            },
        });

        const safeUser: User = {
            ...newUser,
            senha: undefined,
            telefone: newUser.telefone || undefined,
            localizacao: newUser.localizacao || undefined,
            bio: newUser.bio || undefined,
            avatarUrl: newUser.avatarUrl || undefined,
        };

        await setUserSession(event, {
            user: safeUser,
        })
        return {
            success: true,
            message: 'Usuário registrado com sucesso!',
            user: {
                id: newUser.id,
                nome: newUser.nome,
                email: newUser.email,
            },
        };
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);

        if (error instanceof H3Error) {
            throw error;
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Erro interno no servidor.',
        });
    }
});
