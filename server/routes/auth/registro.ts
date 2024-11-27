import { User } from '#auth-utils';
import { PrismaClient } from '@prisma/client';
import { H3Error, defineEventHandler, readBody, createError } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        if (event.method !== 'POST') {
            return {
                status: 405,
                message: 'Método não permitido.',
            };
        }
        const { nome, email, senha, telefone, localizacao } = await readBody(event);

        if (!nome || !email || !senha) {
            return {
                status: 400,
                message: 'Nome, email e senha são obrigatórios.',
            };
        }

        const existingUser = await prisma.usuario.findUnique({
            where: { email },
        });

        if (existingUser) {
            return {
                status: 400,
                message: 'Este email já está registrado.',
            };
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
            status: 200,
            success: true,
            message: 'Usuário registrado com sucesso!',
            user: {
                id: newUser.id,
                nome: newUser.nome,
                email: newUser.email,
            },
        };
    } catch (error) {
        return {
            status: 500,
            message: 'Erro interno no servidor. Tente novamente mais tarde.',
        };
    }
});
