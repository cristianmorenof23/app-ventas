import { getMonthlyHistory, getSellerWithSales } from "@/app/actions/sales";
import MonthlyHistory from "@/app/components/MonthlyHistory";
import SalesEditor from "@/app/components/SalesEditor";

type Props = { 
  params: Promise<{ sellerId: string }>
};

export default async function SellerPage({ params }: Props) {
  const seller = await getSellerWithSales((await params).sellerId);
  const history = await getMonthlyHistory((await params).sellerId);

  if (!seller)
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Vendedor no encontrado
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-10">
      <header className="mb-8">
        <h2 className="text-5xl font-extrabold text-cyan-700 mb-1 select-none">
          {seller.name}
        </h2>
        <p className="text-gray-500 text-base sm:text-lg">
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
          <h3 className="text-xl font-semibold mb-5 text-cyan-600 select-none">
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

                const strokeColor =
                  sale.unitsSold >= sale.target ? '#10b981' : '#06b6d4'; // verde o cyan

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
                      <desc id={`${cat}-desc`}>
                        {progressPercent}% completado
                      </desc>
                      <path
                        d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831"
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="3"
                        strokeDasharray={`${progressPercent}, 100`}
                        strokeLinecap="round"
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

                    <p className="mt-3 text-sm font-medium capitalize text-gray-700 select-text">
                      {cat.toLowerCase()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {sale.unitsSold} / {sale.target} unidades
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
