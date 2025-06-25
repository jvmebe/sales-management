import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query<T>(sql: string, values?: any): Promise<T[]> {
  const [rows] = await pool.execute(sql, values);

  // Convertendo tipo RowDataPacket para T[]
  return rows as T[];
}

export default pool;