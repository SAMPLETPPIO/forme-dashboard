import express from 'express';
import pool from '../db.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const { q } = req.query;
  let query = 'SELECT * FROM clients';
  const params = [];
  if (q) {
    query += ' WHERE name ILIKE $1 OR email ILIKE $1';
    params.push('%' + q + '%');
  }
  query += ' ORDER BY created_at DESC';
  const { rows } = await pool.query(query, params);
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM clients WHERE id=$1', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  const bookings = await pool.query('SELECT * FROM bookings WHERE client_id=$1 ORDER BY date DESC', [req.params.id]);
  res.json({ ...rows[0], bookings: bookings.rows });
});

router.post('/', async (req, res) => {
  const { name, email, phone, membership } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO clients (name, email, phone, membership) VALUES ($1,$2,$3,$4) RETURNING *',
    [name, email, phone, membership || 'Standard']
  );
  res.status(201).json(rows[0]);
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM clients WHERE id=$1', [req.params.id]);
  res.json({ ok: true });
});

export default router;