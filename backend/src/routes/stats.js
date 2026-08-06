import express from 'express';
import pool from '../db.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const today = new Date().toISOString().slice(0,10);
  const totalClients = await pool.query('SELECT COUNT(*) FROM clients');
  const todayBookings = await pool.query('SELECT COUNT(*) FROM bookings WHERE date=$1', [today]);
  const confirmed = await pool.query("SELECT COUNT(*) FROM bookings WHERE status='confirmed'");
  const waitlist = await pool.query("SELECT COUNT(*) FROM bookings WHERE status='waitlist'");
  const revenue = await pool.query('SELECT COUNT(*) * 35 as rev FROM bookings WHERE status=\'confirmed\'');

  const byClass = await pool.query('SELECT class_name, COUNT(*) as count FROM bookings GROUP BY class_name ORDER BY count DESC LIMIT 6');
  const upcoming = await pool.query('SELECT b.*, c.name as client_name FROM bookings b JOIN clients c ON b.client_id=c.id WHERE b.date >= $1 ORDER BY b.date ASC, b.start_time ASC LIMIT 8', [today]);

  res.json({
    totalClients: parseInt(totalClients.rows[0].count),
    todayBookings: parseInt(todayBookings.rows[0].count),
    confirmed: parseInt(confirmed.rows[0].count),
    waitlist: parseInt(waitlist.rows[0].count),
    revenue: parseInt(revenue.rows[0].rev || 0),
    byClass: byClass.rows,
    upcoming: upcoming.rows
  });
});

export default router;