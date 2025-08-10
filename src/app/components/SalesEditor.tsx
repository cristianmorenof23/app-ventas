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
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
      <h3 className="text-2xl font-semibold text-gray-800 text-center mb-8 tracking-tight">
        Ventas (mes actual)
      </h3>

      <div className="space-y-10">
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
              className="bg-gray-50 rounded-xl shadow-md p-6 grid grid-cols-1 sm:grid-cols-5 gap-6 items-center"
            >
              <div className="sm:col-span-1 flex justify-center items-center">
                <label
                  htmlFor={`unitsSold-${cat.key}`}
                  className="text-lg font-medium text-gray-700 select-none"
                >
                  {cat.label}
                </label>
              </div>

              <div className="sm:col-span-2 flex flex-col items-center">
                <label
                  htmlFor={`unitsSold-${cat.key}`}
                  className="mb-2 text-sm text-gray-500"
                >
                  Unidades vendidas
                </label>
                <input
                  id={`unitsSold-${cat.key}`}
                  name="unitsSold"
                  defaultValue={s.unitsSold}
                  type="number"
                  min={0}
                  className="w-full max-w-[120px] border border-gray-300 rounded-md px-4 py-2 text-center text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder="0"
                  required
                />
              </div>

              <div className="sm:col-span-2 flex flex-col items-center">
                <label
                  htmlFor={`target-${cat.key}`}
                  className="mb-2 text-sm text-gray-500"
                >
                  Objetivo
                </label>
                <input
                  id={`target-${cat.key}`}
                  name="target"
                  defaultValue={s.target}
                  type="number"
                  min={0}
                  className="w-full max-w-[120px] border border-gray-300 rounded-md px-4 py-2 text-center text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder="0"
                  required
                />
              </div>

              <div className="sm:col-span-2 flex justify-center">
                <button
                  type="submit"
                  className="middle text-center none center rounded-lg bg-cyan-500 py-4 px-6 font-sans text-sm font-bold uppercase text-white shadow-md shadow-cyan-500/20 transition-all hover:shadow-lg hover:shadow-cyan-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
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
