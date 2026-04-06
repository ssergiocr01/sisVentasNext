import { poolPromise } from '@/lib/db';
import sql from 'mssql';

export const categoriaService = {

  // Obtener todas las categorías activas
  async listar() {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Accion', sql.NVarChar, 'SELECT_ALL')
      .execute('sp_Categorias_Gestion');
    return result.recordset;
  },

  // Crear una nueva categoría
  async crear(nombre: string, logoUrl: string | null, usuarioId: number) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Accion', sql.NVarChar, 'INSERT')
      .input('Nombre', sql.NVarChar, nombre)
      .input('LogoUrl', sql.NVarChar, logoUrl)
      .input('UsuarioId', sql.Int, usuarioId)
      .execute('sp_Categorias_Gestion');
    return result.recordset[0];
  },

  // Actualizar una categoría existente
  async actualizar(id: number, nombre: string, logoUrl: string | null, activa: boolean, usuarioId: number) {
    const pool = await poolPromise;
    await pool.request()
      .input('Accion', sql.NVarChar, 'UPDATE')
      .input('Id', sql.Int, id)
      .input('Nombre', sql.NVarChar, nombre)
      .input('LogoUrl', sql.NVarChar, logoUrl)
      .input('Activa', sql.Bit, activa)
      .input('UsuarioId', sql.Int, usuarioId)
      .execute('sp_Categorias_Gestion');
  },
  
  // Eliminar una categoría existente
  async eliminar(id: number, usuarioId: number) {
    const pool = await poolPromise;
    await pool.request()
      .input('Accion', sql.NVarChar, 'DELETE')
      .input('Id', sql.Int, id)
      .input('UsuarioId', sql.Int, usuarioId)
      .execute('sp_Categorias_Gestion');
  }
};
