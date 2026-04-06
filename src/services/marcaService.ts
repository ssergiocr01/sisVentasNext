import { poolPromise } from '@/lib/db';
import sql from 'mssql';

export const marcaService = {
    async listar() {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Accion', sql.NVarChar, 'SELECT_ALL')
            .execute('sp_Marcas_Gestion');
        return result.recordset;
    },

    async guardar(nombre: string, logoUrl: string | null, usuarioId: number, id?: number) {
        const pool = await poolPromise;
        const request = pool.request()
            .input('Accion', sql.NVarChar, id ? 'UPDATE' : 'INSERT')
            .input('Nombre', sql.NVarChar, nombre)
            .input('LogoUrl', sql.NVarChar, logoUrl)
            .input('UsuarioId', sql.Int, usuarioId);

        if (id) request.input('Id', sql.Int, id);

        await request.execute('sp_Marcas_Gestion');
    },

    async eliminar(id: number, usuarioId: number) {
        const pool = await poolPromise;
        await pool.request()
            .input('Accion', sql.NVarChar, 'DELETE')
            .input('Id', sql.Int, id)
            .input('UsuarioId', sql.Int, usuarioId)
            .execute('sp_Marcas_Gestion');
    }
};
