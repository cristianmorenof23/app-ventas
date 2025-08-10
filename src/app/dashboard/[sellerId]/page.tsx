import { getMonthlyHistory, getSellerWithSales } from "@/app/actions/sales";
import MonthlyHistory from "@/app/components/MonthlyHistory";
import SalesEditor from "@/app/components/SalesEditor";

type Props = { 
  params: Promise<{ sellerId: string }>
};

// Función para calcular días hábiles del mes restando un franco semanal
function calculateWorkingDays(month: number, year: number, weeklyDayOff: number) {
  const date = new Date(year, month - 1, 1);
  let workingDays = 0;

  while (date.getMonth() === month - 1) {
    if (date.getDay() !== weeklyDayOff) {
      workingDays++;
    }
    date.setDate(date.getDate() + 1);
  }
  return workingDays;
}

export default async function SellerPage({ params }: Props) {
  const seller = await getSellerWithSales((await params).sellerId);
  const history = await getMonthlyHistory((await params).sellerId);

  if (!seller)
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Vendedor no encontrado
      </div>
    );

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const weeklyDayOff = 0; // domingo como franco semanal
  const workingDays = calculateWorkingDays(month, year, weeklyDayOff);

  const circumference = 100; // circunferencia fija para los círculos

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-10">
      <header className="mb-8">
        <h2 className="text-5xl font-extrabold text-cyan-700 mb-1 select-none text-center">
          {seller.name}
        </h2>
        <p className="text-gray-500 text-base sm:text-lg text-center">
          Editar ventas por categoría y objetivos
        </p>
      </header>

      <main className="grid gap-8 md:grid-cols-2">
        {/* Editor de ventas */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <SalesEditor sellerId={seller.id} existingSales={seller.sales} />
        </section>

        {/* Progreso global */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-5 text-cyan-600 select-none text-center">
            Progreso global
          </h3>

          <div className="flex flex-wrap gap-6 justify-center">
            {(['CALZADO', 'NINO', 'INDUMENTARIA', 'ACCESORIOS'] as const).map(
              (cat) => {
                const sale =
                  seller.sales.find((s) => s.category === cat) ?? {
                    unitsSold: 0,
                    target: 0,
                  };

                const progressPercent =
                  sale.target > 0
                    ? Math.min(
                        100,
                        Math.round((sale.unitsSold / sale.target) * 100)
                      )
                    : 0;

                // Defino colores según porcentaje:
                let strokeColor = '#e53e3e'; // rojo por defecto (bajo)
                if (progressPercent >= 80) strokeColor = '#10b981'; // verde (muy cerca o cumplido)
                else if (progressPercent >= 50) strokeColor = '#d69e2e'; // amarillo (intermedio)

                // Calculamos el strokeDashoffset para animar el círculo:
                const strokeDashoffset =
                  circumference - (progressPercent / 100) * circumference;

                const dailyTarget =
                  sale.target > 0
                    ? (sale.target / workingDays).toFixed(2)
                    : '0';

                return (
                  <div
                    key={cat}
                    className="flex flex-col items-center w-28 sm:w-32"
                    aria-label={`${cat} progreso`}
                    role="region"
                  >
                    <svg
                      viewBox="0 0 36 36"
                      className="w-28 h-28 sm:w-32 sm:h-32"
                      role="img"
                      aria-labelledby={`${cat}-title ${cat}-desc`}
                      aria-describedby={`${cat}-desc`}
                    >
                      <title id={`${cat}-title`}>{cat} progreso</title>
                      <desc id={`${cat}-desc`}>{progressPercent}% completado</desc>

                      {/* Fondo gris claro */}
                      <path
                        d="M18 2.0845
                           a 15.9155 15.9155 0 0 1 0 31.831
                           a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                      />

                      {/* Progreso animado */}
                      <path
                        d="M18 2.0845
                           a 15.9155 15.9155 0 0 1 0 31.831"
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="3"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                      />

                      <text
                        x="18"
                        y="20.5"
                        fontSize="5"
                        fontWeight="600"
                        textAnchor="middle"
                        fill="#111827"
                      >
                        {progressPercent}%
                      </text>
                    </svg>

                    <p className="mt-3 text-sm font-medium capitalize text-gray-700 select-text text-center">
                      {cat.toLowerCase()}
                    </p>
                    <p className="text-xs text-gray-400 text-center">
                      {sale.unitsSold} / {sale.target} unidades
                    </p>

                    <p className="text-xs text-cyan-600 font-semibold mt-1 text-center">
                      Objetivo diario: {dailyTarget} unidades
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </section>
      </main>

      <section className="mt-10">
        <MonthlyHistory history={history} />
      </section>
    </div>
  );
}
