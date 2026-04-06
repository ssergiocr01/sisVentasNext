import { proveedorService } from '@/services/proveedorService';
import ProveedorLista from './ProveedorLista';

export default async function ProveedoresPage() {
  const proveedores = await proveedorService.listar();
  
  return (
    <div className="max-w-5xl mx-auto">
      <ProveedorLista proveedoresInitial={proveedores} />
    </div>
  );
}
