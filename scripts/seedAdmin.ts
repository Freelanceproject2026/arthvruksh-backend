import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

import { connectDB } from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { hashPassword } from '@/lib/auth/password';

async function seedAdmin() {
  try {
    await connectDB();

    const fullName = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!fullName || !email || !password) {
      throw new Error(
        'Please set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in .env.local'
      );
    }

    const existingAdmin = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (existingAdmin) {
      console.log('✅ Admin already exists.');
      process.exit(0);
    }

    const passwordHash = await hashPassword(password);

    await Admin.create({
      fullName,
      email: email.toLowerCase(),
      passwordHash,
      role: 'super_admin',
      isActive: true,
    });

    console.log('✅ Super Admin created successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed admin:', error);
    process.exit(1);
  }
}

seedAdmin();