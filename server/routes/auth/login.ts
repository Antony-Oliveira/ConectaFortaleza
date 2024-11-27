import { User } from '#auth-utils';
import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody, createError } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        if (event.method !== 'POST') {
            return { 
                status: 405, 
                message: 'Método não permitido.' 
            };
        }

        const { email, senha } = await readBody(event);

        if (!email || !senha) {
            return {
                status: 400,
                message: 'Email e senha são obrigatórios.',
            };
        }

        const user = await prisma.usuario.findUnique({
            where: { email },
        });

        if (!user) {
            return {
                status: 400,
                message: 'Email não encontrado.',
            };
        }

        const isPasswordValid = await verifyPassword(user.senha, senha);

        if (!isPasswordValid) {
            return {
                status: 400,
                message: 'Senha incorreta.',
            };
        }

        const safeUser = {
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

        return {
            status: 200,
            message: 'Login realizado com sucesso!',
            user: safeUser,
        };
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        
        return {
            status: 500,
            message: 'Erro interno no servidor. Tente novamente mais tarde.',
        };
    }
});
