import { NextResponse } from 'next/server';
import { poolPromise } from '@/lib/db';

export async function GET() {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT @@VERSION as version');
    
    return NextResponse.json({ 
      status: 'Conectado', 
      db: result.recordset[0].version 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'Error', 
      message: error.message 
    }, { status: 500 });
  }
}
