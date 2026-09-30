import bcrypt from 'bcryptjs';
import { query } from './src/lib/db';
async function run() {
  const hash = await bcrypt.hash('admin@gts2024', 12);
  const id = crypto.randomUUID();
  await query('INSERT INTO admin_users (id, email, password_hash) VALUES ($1, $2, $3)', [id, 'admin@gts.vn', hash]);
  console.log('Admin inserted!');
}
run().catch(console.error).finally(() => process.exit());
