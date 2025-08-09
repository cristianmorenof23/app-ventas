import { addSeller } from "@/app/actions/seller";

export default function AddSellerPage() {
  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-black">Agregar Vendedor</h1>
      <form action={addSeller} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Nombre del vendedor"
          required
          className="w-full border px-3 py-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full hover:cursor-pointer transition-all"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
