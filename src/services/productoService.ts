import { poolPromise } from '@/lib/db';
import sql from 'mssql';

export const productoService = {
  // Listar productos con sus nombres de categoría/marca/proveedor
  async listar() {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Accion', sql.NVarChar, 'SELECT_ALL')
      .execute('sp_Productos_Gestion');
    return result.recordset;
  },

  async guardar(data: any, usuarioId: number, id?: number) {
    const pool = await poolPromise;
    const request = pool.request()
      .input('Accion', sql.NVarChar, id ? 'UPDATE' : 'INSERT')
      .input('CodigoBarras', sql.NVarChar, data.codigoBarras)
      .input('Nombre', sql.NVarChar, data.nombre)
      .input('PrecioCompra', sql.Decimal(18, 2), data.precioCompra)
      .input('PrecioVenta', sql.Decimal(18, 2), data.precioVenta)
      .input('IvaPorcentaje', sql.Decimal(5, 2), data.ivaPorcentaje)
      .input('ImagenUrl', sql.NVarChar, data.imagenUrl)
      .input('MarcaId', sql.Int, data.marcaId)
      .input('CategoriaId', sql.Int, data.categoriaId)
      .input('ProveedorId', sql.Int, data.proveedorId)
      .input('UsuarioId', sql.Int, usuarioId);

    if (id) request.input('Id', sql.Int, id);

    await request.execute('sp_Productos_Gestion');
  },

  async eliminar(id: number, usuarioId: number) {
    const pool = await poolPromise;
    await pool.request()
      .input('Accion', sql.NVarChar, 'DELETE')
      .input('Id', sql.Int, id)
      .input('UsuarioId', sql.Int, usuarioId)
      .execute('sp_Productos_Gestion');
  }
};
