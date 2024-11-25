import { defineEventHandler, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const user = await getUserSession(event); 

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Usuário não autenticado',
    });
  }

  return event;
});
