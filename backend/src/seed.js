import pool from './db.js';

export async function initDb() {
  await pool.query('CREATE TABLE IF NOT EXISTS clients (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, phone TEXT, membership TEXT DEFAULT \'Standard\', created_at TIMESTAMPTZ DEFAULT NOW())');
  await pool.query('CREATE TABLE IF NOT EXISTS bookings (id SERIAL PRIMARY KEY, client_id INT REFERENCES clients(id) ON DELETE CASCADE, class_name TEXT NOT NULL, trainer TEXT NOT NULL, date DATE NOT NULL, start_time TIME NOT NULL, end_time TIME NOT NULL, status TEXT DEFAULT \'confirmed\', notes TEXT, created_at TIMESTAMPTZ DEFAULT NOW())');

  const { rows } = await pool.query('SELECT COUNT(*) FROM clients');
  if (parseInt(rows[0].count) > 0) {
    console.log('✓ Seed skipped');
    return;
  }

  console.log('Seeding...');

  const clients = [
    ['Alex Morgan', 'alex@forme.fit', '+1 415 555 0123', 'Elite'],
    ['Jordan Lee', 'jordan@forme.fit', '+1 415 555 0145', 'Standard'],
    ['Casey Kim', 'casey@forme.fit', '+1 415 555 0188', 'Pro'],
    ['Riley Chen', 'riley@forme.fit', '+1 415 555 0221', 'Elite'],
    ['Sam Rivera', 'sam@forme.fit', '+1 415 555 0334', 'Standard'],
    ['Taylor Quinn', 'taylor@forme.fit', '+1 415 555 0412', 'Pro']
  ];

  for (const c of clients) {
    await pool.query('INSERT INTO clients (name, email, phone, membership) VALUES ($1,$2,$3,$4)', c);
  }

  const bookings = [
    [1, 'HIIT Burn', 'Maya Patel', '2025-05-20', '07:00', '07:45', 'confirmed', 'Bring towel'],
    [2, 'Pilates Core', 'Jonas Miller', '2025-05-20', '08:30', '09:15', 'confirmed', ''],
    [3, 'Strength Lab', 'Alex Morgan', '2025-05-20', '12:00', '13:00', 'confirmed', 'PR attempt'],
    [4, 'Yoga Flow', 'Sage Park', '2025-05-21', '07:30', '08:15', 'confirmed', ''],
    [5, 'Boxing Drills', 'Marcus Cole', '2025-05-21', '18:00', '19:00', 'waitlist', 'Gloves required'],
    [1, 'Mobility', 'Jonas Miller', '2025-05-22', '09:00', '09:30', 'confirmed', ''],
    [6, 'HIIT Burn', 'Maya Patel', '2025-05-22', '17:30', '18:15', 'confirmed', ''],
    [2, 'Strength Lab', 'Alex Morgan', '2025-05-23', '06:30', '07:30', 'confirmed', '']
  ];

  for (const b of bookings) {
    await pool.query('INSERT INTO bookings (client_id, class_name, trainer, date, start_time, end_time, status, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', b);
  }

  console.log('✓ Seeded 6 clients, 8 bookings');
}