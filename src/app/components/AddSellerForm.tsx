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
        className="w-full border px-3 py-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-cyan-400"
      />
      <button
        type="submit"
        className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 w-full hover:cursor-pointer transition-all"
      >
        Guardar
      </button>
    </form>
  );
}
