import { poolPromise } from '@/lib/db';
import sql from 'mssql';

export const proveedorService = {
  async listar() {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Accion', sql.NVarChar, 'SELECT_ALL')
      .execute('sp_Proveedores_Gestion');
    return result.recordset;
  },

  async guardar(data: any, usuarioId: number, id?: number) {
    const pool = await poolPromise;
    const request = pool.request()
      .input('Accion', sql.NVarChar, id ? 'UPDATE' : 'INSERT')
      .input('Nombre', sql.NVarChar, data.nombre)
      .input('IdentificacionFiscal', sql.NVarChar, data.identificacionFiscal)
      .input('ContactoNombre', sql.NVarChar, data.contactoNombre)
      .input('Telefono', sql.NVarChar, data.telefono)
      .input('Activo', sql.Bit, data.activo ?? true)
      .input('UsuarioId', sql.Int, usuarioId);
    
    if (id) request.input('Id', sql.Int, id);
    
    await request.execute('sp_Proveedores_Gestion');
  },

  async eliminar(id: number, usuarioId: number) {
    const pool = await poolPromise;
    await pool.request()
      .input('Accion', sql.NVarChar, 'DELETE')
      .input('Id', sql.Int, id)
      .input('UsuarioId', sql.Int, usuarioId)
      .execute('sp_Proveedores_Gestion');
  }
};
