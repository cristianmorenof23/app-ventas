'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username')?.toString() || '';
    const password = formData.get('password')?.toString() || '';

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error desconocido');
        return;
      }

      router.push('/dashboard');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setError('Error de red');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center text-black">Iniciar sesión</h1>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <input
          type="text"
          name="username"
          placeholder="Usuario"
          autoComplete="username"
          className="w-full p-2 border rounded text-black"
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          autoComplete="current-password"
          className="w-full p-2 border rounded text-black"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
