'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { deleteSeller, getSellers } from '@/app/actions/seller';
import AddSellerForm from './AddSellerForm';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [sellers, setSellers] = useState<{ id: string; name: string }[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function fetchSellers() {
      const data = await getSellers();
      setSellers(data);
    }
    fetchSellers();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteSeller(id);
    setSellers((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAdded = async () => {
    const data = await getSellers();
    setSellers(data);
  };

  const handleOverlayClick = () => setIsOpen(false);

  // Extraemos el sellerId actual del path
  const currentSellerId = pathname?.split('/dashboard/')[1] ?? null;

  return (
    <>
      {/* Botón menú hamburguesa, fijo arriba a la izquierda en móviles */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-30 md:hidden p-3 rounded-md bg-cyan-600 text-white shadow-lg hover:bg-cyan-700 transition"
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        {isOpen ? '×' : '☰'}
      </button>

      {/* Overlay semitransparente cuando el menú está abierto en móvil */}
      {isOpen && (
        <div
          onClick={handleOverlayClick}
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-30 inset-y-0 left-0 transform bg-white w-64 shadow-md transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:relative md:translate-x-0`}
        aria-label="Menú lateral de vendedores"
      >
        <div className="p-6 font-extrabold text-2xl border-b border-cyan-400 text-cyan-700 select-none text-center tracking-wide">
          Vendedores
        </div>

        <ul className="p-4 space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {sellers.map((seller) => {
            const isSelected = seller.id === currentSellerId;
            return (
              <li key={seller.id} className="flex items-center justify-between">
                <span
                  onClick={() => {
                    router.push(`/dashboard/${seller.id}`);
                    setIsOpen(false);
                  }}
                  className={`
                    flex-grow text-center py-3 rounded-md font-semibold transition
                    cursor-pointer select-none
                    ${isSelected
                      ? 'bg-cyan-700 text-white shadow-md'
                      : 'text-cyan-600 hover:bg-cyan-100 hover:text-cyan-800'}
                  `}
                  aria-current={isSelected ? 'page' : undefined}
                >
                  {seller.name}
                </span>
                <button
                  onClick={() => handleDelete(seller.id)}
                  className="ml-3 text-red-500 hover:text-red-700 hover:cursor-pointer text-xl font-bold select-none"
                  type="button"
                  aria-label={`Eliminar vendedor ${seller.name}`}
                >
                  ×
                </button>
              </li>
            );
          })}
        </ul>

        <div className="p-4 border-t border-cyan-300">
          <AddSellerForm onAdded={handleAdded} />
        </div>
      </aside>
    </>
  );
}
