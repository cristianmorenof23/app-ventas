'use server';

import { redirect } from 'next/navigation';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

export async function loginAction(formData: FormData) {
  const username = formData.get('username')?.toString();
  const password = formData.get('password')?.toString();

  if (!username || !password) {
    redirect('/login?error=Faltan campos');
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    redirect('/login?error=Usuario o contraseña inválidos');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    redirect('/login?error=Usuario o contraseña inválidos');
  }

  const cookie = `session=${user.id}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24}`;

  // En lugar de usar cookies().set, devolvés Response con header Set-Cookie:
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/dashboard',
      'Set-Cookie': cookie,
    },
  });
}
