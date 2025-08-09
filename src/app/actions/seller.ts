'use server';

import { prisma } from '../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getSellers() {
  return await prisma.seller.findMany({ orderBy: { createdAt: 'asc' } });
}

export async function addSeller(formData: FormData) {
  const name = formData.get('name')?.toString();
  if (!name || name.trim().length < 2) return;

  await prisma.seller.create({ data: { name } });
  revalidatePath('/dashboard');
}

export async function deleteSeller(id: string) {
  await prisma.seller.delete({ where: { id } });
  revalidatePath('/dashboard');
}
