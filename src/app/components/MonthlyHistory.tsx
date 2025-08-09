// src/components/MonthlyHistory.tsx
import React from 'react';

type HistoryEntry = {
  year: number;
  month: number;
  _sum: { unitsSold: number | null };
};

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export default function MonthlyHistory({ history }: { history: HistoryEntry[] }) {
  if (!history || history.length === 0) {
    return (
      <div className="bg-white p-6 rounded shadow text-center text-gray-500 font-medium">
        No hay histórico de ventas
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-semibold mb-5 text-cyan-700 text-lg select-none">Histórico mensual</h3>
      <div className="overflow-x-auto rounded-md border border-cyan-200">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-cyan-100 text-cyan-700 uppercase">
            <tr>
              <th className="p-3 text-left min-w-[70px]">Año</th>
              <th className="p-3 text-left min-w-[120px]">Mes</th>
              <th className="p-3 text-right min-w-[150px]">Total unidades</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr
                key={`${h.year}-${h.month}`}
                className={i % 2 === 0 ? 'bg-cyan-50' : 'bg-white'}
              >
                <td className="p-3 font-medium text-gray-700">{h.year}</td>
                <td className="p-3 text-gray-600">{monthNames[h.month - 1] || h.month}</td>
                <td className="p-3 text-right font-semibold text-cyan-700">
                  {h._sum.unitsSold ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
