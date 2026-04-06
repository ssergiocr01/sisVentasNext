import sql from 'mssql';

const config: sql.config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_DATABASE,
    options: {
      encrypt: false, 
      trustServerCertificate: true, 
      instanceName: 'SQLEXPRESS' // <-- Muévela aquí dentro
    }
  };
  

export const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Conexión exitosa a SQL Server con usuario SA');
    return pool;
  })
  .catch(err => {
    console.error('❌ Error de conexión:', err.message);
    throw err;
  });
