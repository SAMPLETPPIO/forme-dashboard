import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgres://forme:forme_secret@localhost:5432/forme_db' });
export async function waitForDb(retries=20){ for(let i=0;i<retries;i++){ try{ await pool.query('SELECT 1'); console.log('✓ DB connected'); return; }catch{ console.log(`DB retry ${i+1}`); await new Promise(r=>setTimeout(r,2000)); } } throw new Error('DB failed'); }
export default pool;