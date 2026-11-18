import bcrypt from 'bcryptjs';
import { pool } from './pool.js';
import { runMigrations } from './migrate.js';

export async function runSeed() {
  await runMigrations();

  const client = await pool.connect();
  try {
    console.log('Seeding initial database records...');
    await client.query('BEGIN');

    // Default categories
    const categories = [
      { name: 'Food & Dining', type: 'expense', color: '#f59e0b', icon: 'Utensils' },
      { name: 'Transportation', type: 'expense', color: '#3b82f6', icon: 'Car' },
      { name: 'Housing & Rent', type: 'expense', color: '#8b5cf6', icon: 'Home' },
      { name: 'Entertainment', type: 'expense', color: '#ec4899', icon: 'Film' },
      { name: 'Utilities', type: 'expense', color: '#10b981', icon: 'Zap' },
      { name: 'Healthcare', type: 'expense', color: '#ef4444', icon: 'HeartPulse' },
      { name: 'Shopping', type: 'expense', color: '#06b6d4', icon: 'ShoppingBag' },
      { name: 'Travel', type: 'expense', color: '#f97316', icon: 'Plane' },
      { name: 'Salary', type: 'income', color: '#22c55e', icon: 'Briefcase' },
      { name: 'Freelance', type: 'income', color: '#14b8a6', icon: 'Laptop' },
      { name: 'Investments', type: 'income', color: '#6366f1', icon: 'TrendingUp' },
      { name: 'Other Income', type: 'income', color: '#84cc16', icon: 'PlusCircle' },
    ];

    for (const cat of categories) {
      await client.query(
        `INSERT INTO categories (name, type, color, icon)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (name) DO UPDATE SET color = EXCLUDED.color, icon = EXCLUDED.icon;`,
        [cat.name, cat.type, cat.color, cat.icon]
      );
    }

    // Default users
    const salt = await bcrypt.genSalt(10);
    const demoUsers = [
      {
        email: 'admin@finance.com',
        name: 'Admin User',
        role: 'admin',
        password: 'AdminPassword123!',
      },
      {
        email: 'user@finance.com',
        name: 'Standard User',
        role: 'user',
        password: 'UserPassword123!',
      },
      {
        email: 'readonly@finance.com',
        name: 'Read Only Viewer',
        role: 'read-only',
        password: 'ReadOnlyPassword123!',
      },
    ];

    const userMap: Record<string, number> = {};

    for (const u of demoUsers) {
      const hash = await bcrypt.hash(u.password, salt);
      const res = await client.query(
        `INSERT INTO users (email, password_hash, name, role)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, name = EXCLUDED.name
         RETURNING id, email;`,
        [u.email, hash, u.name, u.role]
      );
      userMap[u.email] = res.rows[0].id;
    }

    // Fetch category IDs
    const catRes = await client.query('SELECT id, name FROM categories;');
    const catMap: Record<string, number> = {};
    for (const row of catRes.rows) {
      catMap[row.name] = row.id;
    }

    // Seed realistic sample transactions for the standard user & read-only user
    const sampleTransactions = [
      // Standard user data
      { email: 'user@finance.com', cat: 'Salary', type: 'income', amount: 4500.00, date: '2026-11-01', desc: 'Monthly Salary November' },
      { email: 'user@finance.com', cat: 'Housing & Rent', type: 'expense', amount: 1200.00, date: '2026-11-02', desc: 'Apartment Monthly Rent' },
      { email: 'user@finance.com', cat: 'Food & Dining', type: 'expense', amount: 145.50, date: '2026-11-04', desc: 'Weekly Groceries' },
      { email: 'user@finance.com', cat: 'Utilities', type: 'expense', amount: 85.00, date: '2026-11-06', desc: 'Electricity & Internet Bill' },
      { email: 'user@finance.com', cat: 'Transportation', type: 'expense', amount: 45.00, date: '2026-11-08', desc: 'Metro transit card recharge' },
      { email: 'user@finance.com', cat: 'Entertainment', type: 'expense', amount: 35.00, date: '2026-11-10', desc: 'Cinema and streaming services' },
      { email: 'user@finance.com', cat: 'Freelance', type: 'income', amount: 850.00, date: '2026-11-12', desc: 'Web design consulting gig' },
      { email: 'user@finance.com', cat: 'Food & Dining', type: 'expense', amount: 68.20, date: '2026-11-13', desc: 'Dinner with colleagues' },
      { email: 'user@finance.com', cat: 'Shopping', type: 'expense', amount: 120.00, date: '2026-11-14', desc: 'Winter jacket and clothes' },
      { email: 'user@finance.com', cat: 'Healthcare', type: 'expense', amount: 60.00, date: '2026-11-15', desc: 'Pharmacy and vitamins' },

      // Prior months for trend analysis (October 2026)
      { email: 'user@finance.com', cat: 'Salary', type: 'income', amount: 4500.00, date: '2026-10-01', desc: 'Monthly Salary October' },
      { email: 'user@finance.com', cat: 'Housing & Rent', type: 'expense', amount: 1200.00, date: '2026-10-02', desc: 'Apartment Monthly Rent' },
      { email: 'user@finance.com', cat: 'Food & Dining', type: 'expense', amount: 480.00, date: '2026-10-15', desc: 'October Groceries' },
      { email: 'user@finance.com', cat: 'Travel', type: 'expense', amount: 350.00, date: '2026-10-20', desc: 'Weekend getaway trip' },
      { email: 'user@finance.com', cat: 'Investments', type: 'income', amount: 300.00, date: '2026-10-28', desc: 'Dividend payout' },

      // Prior months for trend analysis (September 2026)
      { email: 'user@finance.com', cat: 'Salary', type: 'income', amount: 4500.00, date: '2026-09-01', desc: 'Monthly Salary September' },
      { email: 'user@finance.com', cat: 'Housing & Rent', type: 'expense', amount: 1200.00, date: '2026-09-02', desc: 'Apartment Monthly Rent' },
      { email: 'user@finance.com', cat: 'Food & Dining', type: 'expense', amount: 420.00, date: '2026-09-18', desc: 'September Groceries' },
      { email: 'user@finance.com', cat: 'Transportation', type: 'expense', amount: 110.00, date: '2026-09-24', desc: 'Fuel and parking' },

      // Read-only user data
      { email: 'readonly@finance.com', cat: 'Salary', type: 'income', amount: 3800.00, date: '2026-11-01', desc: 'Monthly Salary November' },
      { email: 'readonly@finance.com', cat: 'Housing & Rent', type: 'expense', amount: 950.00, date: '2026-11-02', desc: 'Monthly Rent' },
      { email: 'readonly@finance.com', cat: 'Food & Dining', type: 'expense', amount: 320.00, date: '2026-11-07', desc: 'Groceries' },
      { email: 'readonly@finance.com', cat: 'Utilities', type: 'expense', amount: 75.00, date: '2026-11-12', desc: 'Water and Internet' },
    ];

    // Clear existing sample transactions to avoid duplicates on re-seed
    await client.query('DELETE FROM transactions WHERE user_id IN ($1, $2, $3);', [
      userMap['admin@finance.com'],
      userMap['user@finance.com'],
      userMap['readonly@finance.com'],
    ]);

    for (const tx of sampleTransactions) {
      const uId = userMap[tx.email];
      const cId = catMap[tx.cat];
      if (uId && cId) {
        await client.query(
          `INSERT INTO transactions (user_id, category_id, type, amount, date, description)
           VALUES ($1, $2, $3, $4, $5, $6);`,
          [uId, cId, tx.type, tx.amount, tx.date, tx.desc]
        );
      }
    }

    await client.query('COMMIT');
    console.log('Seeding completed successfully with demo users, categories, and transactions.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

if (process.argv[1]?.includes('seed.ts')) {
  runSeed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
