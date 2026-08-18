import express from 'express';
import cors from 'cors';
import { waitForDb } from './db.js';
import { initDb } from './seed.js';
import bookingsRouter from './routes/bookings.js';
import clientsRouter from './routes/clients.js';
import statsRouter from './routes/stats.js';
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors()); app.use(express.json());
app.get('/api/health', (req,res)=>res.json({status:'ok'}));
app.use('/api/bookings', bookingsRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/stats', statsRouter);
async function start(){ await waitForDb(); await initDb(); app.listen(PORT,'0.0.0.0',()=>console.log(`API :${PORT}`)); }
start();
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  next();
});
