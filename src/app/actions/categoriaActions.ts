'use server'
import { categoriaService } from '@/services/categoriaService';
import { revalidatePath } from 'next/cache';

export async function guardarCategoriaAction(formData: FormData, id?: number) {
  const nombre = formData.get('nombre') as string;
  const logoUrl = formData.get('logoUrl') as string || null;
  const usuarioId = 1;

  if (id) {
    await categoriaService.actualizar(id, nombre, logoUrl, true, usuarioId);
  } else {
    await categoriaService.crear(nombre, logoUrl, usuarioId);
  }
  revalidatePath('/categorias');
}

export async function eliminarCategoriaAction(id: number) {
  const usuarioId = 1;
  await categoriaService.eliminar(id, usuarioId);
  revalidatePath('/categorias');
}
