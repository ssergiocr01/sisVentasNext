import { categoriaService } from '@/services/categoriaService';
import CategoriaLista from './CategoriaLista';

export default async function CategoriasPage() {
  const categorias = await categoriaService.listar();
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <CategoriaLista categoriasInitial={categorias} />
      </div>
    </main>
  );
}
