'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addSeller } from '@/app/actions/seller';

export default function AddSellerForm({ onAdded }: { onAdded: () => void }) {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return;

    const formData = new FormData();
    formData.set('name', name);

    await addSeller(formData);
    setName('');
    onAdded();  // avisar al padre para refrescar
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Nombre del vendedor"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-cyan-300 p-2 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
      />
      <button
        type="submit"
        className="middle text-center none center w-full rounded-lg bg-cyan-500 py-4 px-6 font-sans text-sm font-bold uppercase text-white shadow-md shadow-cyan-500/20 transition-all hover:shadow-lg hover:shadow-cyan-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
      >
        Guardar
      </button>
    </form>
  );
}
