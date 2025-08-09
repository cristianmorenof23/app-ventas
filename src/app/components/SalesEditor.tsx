'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { upsertSale } from '../actions/sales';

type Sale = {
  id: string;
  category: string;
  unitsSold: number;
  target: number;
  month: number;
  year: number;
};

export default function SalesEditor({
  sellerId,
  existingSales,
}: {
  sellerId: string;
  existingSales: Sale[];
}) {
  const router = useRouter();
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  function findSale(cat: string) {
    return existingSales.find(
      (s) => s.category === cat && s.month === month && s.year === year
    );
  }

  const categories = [
    { key: 'CALZADO', label: 'Calzado' },
    { key: 'NINO', label: 'Niño' },
    { key: 'INDUMENTARIA', label: 'Indumentaria' },
    { key: 'ACCESORIOS', label: 'Accesorios' },
  ];

  return (
    <div className="bg-white rounded shadow p-6">
      <h3 className="font-semibold mb-5 text-cyan-700 text-lg">Ventas (mes actual)</h3>

      <div className="space-y-6">
        {categories.map((cat) => {
          const s = findSale(cat.key) ?? { unitsSold: 0, target: 0 };
          return (
            <form
              key={cat.key}
              action={async (formData) => {
                formData.set('sellerId', sellerId);
                formData.set('category', cat.key);
                formData.set('month', month.toString());
                formData.set('year', year.toString());
                await upsertSale(formData);
                router.refresh();
              }}
              className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end"
            >
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-cyan-700 select-none">
                  {cat.label}
                </label>
              </div>

              <div>
                <label className="block text-xs text-cyan-500 mb-1">Unidades vendidas</label>
                <input
                  name="unitsSold"
                  defaultValue={s.unitsSold}
                  type="number"
                  min={0}
                  className="w-full border-2 border-cyan-300 rounded-md px-4 py-2 text-base text-gray-900 placeholder-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-cyan-500 mb-1">Objetivo</label>
                <input
                  name="target"
                  defaultValue={s.target}
                  type="number"
                  min={0}
                  className="w-full border-2 border-cyan-300 rounded-md px-4 py-2 text-base text-gray-900 placeholder-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  placeholder="0"
                  required
                />
              </div>

              <div className="sm:col-span-4 flex gap-3 mt-3 sm:mt-0">
                <button
                  type="submit"
                  className="bg-cyan-600 hover:cursor-pointer hover:bg-cyan-700 text-white px-5 py-2 rounded-md text-sm transition"
                >
                  Guardar
                </button>
              </div>
            </form>
          );
        })}
      </div>
    </div>
  );
}
