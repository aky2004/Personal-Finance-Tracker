import { pool } from './pool.js';

export async function runMigrations() {
  const client = await pool.connect();
  try {
    console.log('Running database migrations...');
    await client.query('BEGIN');

    // 1. Users table with role field (default: 'user')
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'read-only')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 2. Categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        type VARCHAR(20) NOT NULL DEFAULT 'expense' CHECK (type IN ('income', 'expense')),
        color VARCHAR(30) DEFAULT '#6366f1',
        icon VARCHAR(50) DEFAULT 'Tag',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 3. Transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
        amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 4. Indexes for fast search, filter, pagination and analytics aggregation
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
      CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
      CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, date DESC);
    `);

    await client.query('COMMIT');
    console.log('Migrations completed successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

if (process.argv[1]?.includes('migrate.ts')) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
