// src/actions/sales.ts
'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../lib/prisma';

export async function getSellerWithSales(sellerId: string) {
  return prisma.seller.findUnique({
    where: { id: sellerId },
    include: {
      sales: true,
    },
  });
}

export async function upsertSale(formData: FormData) {
  const sellerId = formData.get('sellerId')?.toString();
  const category = formData.get('category')?.toString();
  const unitsSold = Number(formData.get('unitsSold') ?? 0);
  const target = Number(formData.get('target') ?? 0);
  const month = Number(formData.get('month') ?? 0);
  const year = Number(formData.get('year') ?? 0);

  if (!sellerId || !category || !month || !year) return;

  await prisma.sale.upsert({
    where: {
      id: `${sellerId}-${category}-${month}-${year}`, // pseudo id approach OR replace with findFirst
    },
    update: {
      unitsSold,
      target,
    },
    create: {
      id: `${sellerId}-${category}-${month}-${year}`,
      sellerId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      category: category as any,
      unitsSold,
      target,
      month,
      year,
    },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }).catch(async (err) => {
    const existing = await prisma.sale.findFirst({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      where: { sellerId, category: category as any, month, year },
    });
    if (existing) {
      await prisma.sale.update({
        where: { id: existing.id },
        data: { unitsSold, target },
      });
    } else {
      await prisma.sale.create({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: { sellerId, category: category as any, unitsSold, target, month, year },
      });
    }
  });

  revalidatePath(`/dashboard/${sellerId}`);
}

export async function deleteSale(saleId: string) {
  await prisma.sale.delete({ where: { id: saleId } });
}

export async function getMonthlyHistory(sellerId: string) {
  const rows = await prisma.sale.groupBy({
    by: ['year', 'month'],
    where: { sellerId },
    _sum: { unitsSold: true },
    orderBy: [{ year: 'desc' }, { month: 'desc' }],
  });

  return rows; // [{ year, month, _sum: { unitsSold } }, ...]
}
