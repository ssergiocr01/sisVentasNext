import { poolPromise } from '@/lib/db';
import sql from 'mssql';

export async function listarCategorias() {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Accion', sql.NVarChar, 'SELECT_ALL')
      .execute('sp_Categorias_Gestion');
    
    return result.recordset;
  } catch (error) {
    console.error("Error en listarCategorias:", error);
    return [];
  }
}
