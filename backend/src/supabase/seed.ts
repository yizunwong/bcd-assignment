import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { Database } from './types/supabase.types';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

// ENV: set in .env file
const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

type SeedUser = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  policyholder?: Omit<
    Database['public']['Tables']['policyholder_details']['Insert'],
    'user_id'
  >;
  admin?: Omit<
    Database['public']['Tables']['admin_details']['Insert'],
    'user_id'
  >;
  role: 'policyholder' | 'insurance_admin';
};

const users: SeedUser[] = [
  {
    email: 'alex.johnson@example.com',
    password: 'Password123!',
    firstName: 'Alex',
    lastName: 'Johnson',
    role: 'policyholder',
    policyholder: {
      date_of_birth: '1990-01-01',
      occupation: 'Engineer',
      address: 'New York, USA',
    },
  },
  {
    email: 'sarah.chen@example.com',
    password: 'Password123!',
    firstName: 'Sarah',
    lastName: 'Chen',
    role: 'insurance_admin',
    admin: {
      company_id: 1,
      verified_at: new Date().toISOString(),
    },
  },
];

async function seed() {
  console.log('🌱 Seeding roles and permissions...');
  for (const user of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      app_metadata: { role: user.role },
    });

    if (error || !data?.user) {
      console.error(`❌ Failed to create ${user.email}:`, error?.message);
      continue;
    }

    const userId = data.user.id;

    await supabase.from('user_details').insert({
      user_id: userId,
      first_name: user.firstName,
      last_name: user.lastName,
      phone: user.phone ?? null,
      status: 'active',
    });

    if (user.policyholder) {
      await supabase
        .from('policyholder_details')
        .insert({ user_id: userId, ...user.policyholder });
    }

    if (user.admin) {
      await supabase
        .from('admin_details')
        .insert({ user_id: userId, ...user.admin });
    }

    await supabase.from('activity_logs').insert([
      {
        user_id: userId,
        action: 'Account Created',
        timestamp: new Date().toISOString(),
        ip: '127.0.0.1',
      },
      {
        user_id: userId,
        action:
          user.role === 'policyholder' ? 'Policy Viewed' : 'Claim Reviewed',
        timestamp: new Date(Date.now() - 3600 * 1000).toISOString(),
        ip: '127.0.0.1',
      },
    ]);

    console.log(`✅ Created user and profile: ${user.email}`);
  }

  console.log('\n🎉 Seeding complete.');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
});
