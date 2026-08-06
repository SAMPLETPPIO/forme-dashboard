import express from 'express';
import pool from '../db.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const { date, status, q } = req.query;
  let query = 'SELECT b.*, c.name as client_name, c.email as client_email FROM bookings b JOIN clients c ON b.client_id = c.id WHERE 1=1';
  const params = [];
  let idx = 1;
  if (date) { query += ' AND b.date = $' + idx++; params.push(date); }
  if (status) { query += ' AND b.status = $' + idx++; params.push(status); }
  if (q) { query += ' AND (b.class_name ILIKE $' + idx + ' OR c.name ILIKE $' + idx + ' OR b.trainer ILIKE $' + idx + ')'; params.push('%' + q + '%'); idx++; }
  query += ' ORDER BY b.date ASC, b.start_time ASC';
  const { rows } = await pool.query(query, params);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { client_id, class_name, trainer, date, start_time, end_time, status, notes } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO bookings (client_id, class_name, trainer, date, start_time, end_time, status, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
    [client_id, class_name, trainer, date, start_time, end_time, status || 'confirmed', notes || '']
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { class_name, trainer, date, start_time, end_time, status, notes } = req.body;
  const { rows } = await pool.query(
    'UPDATE bookings SET class_name=$1, trainer=$2, date=$3, start_time=$4, end_time=$5, status=$6, notes=$7 WHERE id=$8 RETURNING *',
    [class_name, trainer, date, start_time, end_time, status, notes, id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM bookings WHERE id=$1', [req.params.id]);
  res.json({ ok: true });
});

export default router;