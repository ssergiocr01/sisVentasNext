'use server'
import { proveedorService } from '@/services/proveedorService';
import { revalidatePath } from 'next/cache';

export async function guardarProveedorAction(formData: FormData, id?: number) {
  const data = {
    nombre: formData.get('nombre') as string,
    identificacionFiscal: formData.get('identificacionFiscal') as string,
    contactoNombre: formData.get('contactoNombre') as string,
    telefono: formData.get('telefono') as string,
  };
  const usuarioId = 1;

  await proveedorService.guardar(data, usuarioId, id);
  revalidatePath('/proveedores');
}

export async function eliminarProveedorAction(id: number) {
  const usuarioId = 1;
  await proveedorService.eliminar(id, usuarioId);
  revalidatePath('/proveedores');
}
