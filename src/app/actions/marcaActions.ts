'use server'
import { marcaService } from '@/services/marcaService';
import { revalidatePath } from 'next/cache';

export async function guardarMarcaAction(formData: FormData, id?: number) {
  const nombre = formData.get('nombre') as string;
  const logoUrl = formData.get('logoUrl') as string || null;
  const usuarioId = 1;

  await marcaService.guardar(nombre, logoUrl, usuarioId, id);
  revalidatePath('/marcas');
}

export async function eliminarMarcaAction(id: number) {
  const usuarioId = 1;
  await marcaService.eliminar(id, usuarioId);
  revalidatePath('/marcas');
}
