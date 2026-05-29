import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'farmmart',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query(
  sql: string,
  values?: unknown[]
): Promise<[unknown, mysql.FieldPacket[]]> {
  const connection = await pool.getConnection();
  try {
    return await connection.query(sql, values);
  } finally {
    connection.release();
  }
}

export async function executeQuery<T>(
  sql: string,
  values?: unknown[]
): Promise<T[]> {
  const [rows] = await query(sql, values);
  return rows as T[];
}

export async function executeInsert(
  sql: string,
  values?:unknown[]
): Promise<{ insertId: number; affectedRows: number }> {
  const [result] = await query(sql, values);
  return result as { insertId: number; affectedRows: number };
}

export async function executeUpdate(
  sql: string,
  values?: unknown[]
): Promise<{ affectedRows: number; changedRows: number }> {
  const [result] = await query(sql, values);
  return result as { affectedRows: number; changedRows: number };
}

export async function executeDelete(
  sql: string,
  values?: unknown[]
): Promise<{ affectedRows: number }> {
  const [result] = await query(sql, values);
  return result as { affectedRows: number };
}

export default pool;
