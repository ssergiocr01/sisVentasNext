'use server'
import { productoService } from '@/services/productoService';
import { revalidatePath } from 'next/cache';

export async function guardarProductoAction(formData: FormData, id?: number) {
  const data = {
    codigoBarras: formData.get('codigoBarras') as string,
    nombre: formData.get('nombre') as string,
    precioCompra: parseFloat(formData.get('precioCompra') as string),
    precioVenta: parseFloat(formData.get('precioVenta') as string),
    ivaPorcentaje: parseFloat(formData.get('ivaPorcentaje') as string) || 0,
    imagenUrl: formData.get('imagenUrl') as string || null,
    marcaId: parseInt(formData.get('marcaId') as string),
    categoriaId: parseInt(formData.get('categoriaId') as string),
    proveedorId: parseInt(formData.get('proveedorId') as string),
  };
  
  const usuarioId = 1; // Temporal
  await productoService.guardar(data, usuarioId, id);
  revalidatePath('/productos');
}

export async function eliminarProductoAction(id: number) {
  const usuarioId = 1;
  await productoService.eliminar(id, usuarioId);
  revalidatePath('/productos');
}
