'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteSeller, getSellers } from '@/app/actions/seller';
import AddSellerForm from './AddSellerForm';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [sellers, setSellers] = useState<{ id: string; name: string }[]>([]);
  const router = useRouter();

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

  // Cierra el menú si clickeas fuera del sidebar en móvil
  const handleOverlayClick = () => setIsOpen(false);

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
        <div className="p-4 font-bold text-lg border-b border-cyan-400 text-cyan-700 select-none">
          Vendedores
        </div>

        <ul className="p-4 space-y-2 max-h-[calc(100vh-10rem)] overflow-y-auto">
          {sellers.map((seller) => (
            <li
              key={seller.id}
              className="flex items-center justify-between"
            >
              <span
                className="text-cyan-600 cursor-pointer hover:underline hover:text-cyan-800"
                onClick={() => {
                  router.push(`/dashboard/${seller.id}`);
                  setIsOpen(false); // cerrar menú en móvil al seleccionar vendedor
                }}
              >
                {seller.name}
              </span>
              <button
                onClick={() => handleDelete(seller.id)}
                className="ml-2 text-red-500 hover:text-red-700 hover:cursor-pointer"
                type="button"
                aria-label={`Eliminar vendedor ${seller.name}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>

        <div className="p-4 border-t border-cyan-300">
          <AddSellerForm onAdded={handleAdded} />
        </div>
      </aside>
    </>
  );
}
