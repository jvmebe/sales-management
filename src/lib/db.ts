// src/lib/db.ts (Corrigido)
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '123',
	database: 'sale_system',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

// A mudança principal está aqui, na assinatura e no retorno da função
export async function query(sql: string, values?: any): Promise<any[]> {
	try {
		const [rows] = await pool.execute(sql, values);
		// Asseguramos que o retorno seja sempre um array, que é o que o #each espera.
		// Para queries SELECT, `rows` já é um array. Para outras, isso evita erros.
		return Array.isArray(rows) ? rows : [];
	} catch (error) {
		console.error('Erro na consulta ao banco de dados:', error);
		// Em caso de erro, retorna um array vazio para não quebrar a interface.
		return [];
	}
}

export async function transaction<T>(cb: (conn: mysql.PoolConnection) => Promise<T>): Promise<T> {
	const conn = await pool.getConnection();
	try {
		await conn.beginTransaction();
		const result = await cb(conn);
		await conn.commit();
		return result;
	} catch (err) {
		await conn.rollback();
		throw err;
	} finally {
		conn.release();
	}
}