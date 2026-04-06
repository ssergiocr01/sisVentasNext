import { marcaService } from '@/services/marcaService';
import MarcaLista from './MarcaLista';

export default async function MarcasPage() {
  const marcas = await marcaService.listar();
  
  return (
    // Este contenedor centra el contenido y limita el ancho máximo
    <div className="max-w-5xl mx-auto">
      <MarcaLista marcasInitial={marcas} />
    </div>
  );
}
