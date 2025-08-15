import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { Database } from './types/supabase.types';
import { PolicyCategory, PolicyStatus } from 'src/enums';

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
  let adminId: string | null = null;
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

    if (user.role === 'insurance_admin') {
      adminId = userId;
    }

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

    // Add sample notifications
    await supabase.from('notifications').insert([
      {
        user_id: userId,
        title: 'Welcome to Coverly!',
        message:
          "Thank you for joining our platform. We're excited to have you on board.",
        notification_type: 'success',
        read: false,
      },
      {
        user_id: userId,
        title: 'Account Setup Complete',
        message:
          'Your account has been successfully set up. You can now start exploring our services.',
        notification_type: 'info',
        read: false,
      },
      {
        user_id: userId,
        title: 'Security Reminder',
        message:
          'Please ensure your password is strong and enable two-factor authentication for enhanced security.',
        notification_type: 'warning',
        read: true,
      },
    ]);

    console.log(`✅ Created user and profile: ${user.email}`);
  }

  if (adminId) {
    console.log('\n🌱 Seeding policies...');
    const policies = [
      {
        id: 1,
        name: 'Basic Health Plan',
        category: PolicyCategory.HEALTH,
        coverage: 10000,
        description: 'Affordable health coverage',
        duration_days: 365,
        premium: 0.0001,
        rating: 4.2,
        status: PolicyStatus.ACTIVE,
        popular: true,
        created_by: adminId,
      },
      {
        id: 2,
        name: 'Premium Health Plan',
        category: PolicyCategory.HEALTH,
        coverage: 50000,
        description: 'Comprehensive health coverage',
        duration_days: 365,
        premium: 0.0002,
        rating: 4.8,
        status: PolicyStatus.ACTIVE,
        popular: true,
        created_by: adminId,
      },
      {
        id: 3,
        name: 'Traveler Shield',
        category: PolicyCategory.TRAVEL,
        coverage: 20000,
        description: 'Travel insurance for trips',
        duration_days: 30,
        premium: 0.0003,
        rating: 4.5,
        status: PolicyStatus.ACTIVE,
        popular: false,
        created_by: adminId,
      },
      {
        id: 4,
        name: 'Crop Guard Basic',
        category: PolicyCategory.CROP,
        coverage: 15000,
        description: 'Entry level crop protection',
        duration_days: 180,
        premium: 0.0004,
        rating: 4.1,
        status: PolicyStatus.ACTIVE,
        popular: false,
        created_by: adminId,
      },
      {
        id: 5,
        name: 'Crop Guard Plus',
        category: PolicyCategory.CROP,
        coverage: 30000,
        description: 'Advanced crop protection',
        duration_days: 180,
        premium: 0.0005,
        rating: 4.3,
        status: PolicyStatus.ACTIVE,
        popular: true,
        created_by: adminId,
      },
      {
        id: 6,
        name: 'Travel Elite',
        category: PolicyCategory.TRAVEL,
        coverage: 50000,
        description: 'Premium travel coverage',
        duration_days: 60,
        premium: 0.0006,
        rating: 4.7,
        status: PolicyStatus.ACTIVE,
        popular: true,
        created_by: adminId,
      },
      {
        id: 7,
        name: 'Family Health Secure',
        category: PolicyCategory.HEALTH,
        coverage: 75000,
        description: 'Health coverage for family',
        duration_days: 365,
        premium: 0.0007,
        rating: 4.4,
        status: PolicyStatus.ACTIVE,
        popular: false,
        created_by: adminId,
      },
      {
        id: 8,
        name: 'Senior Health Care',
        category: PolicyCategory.HEALTH,
        coverage: 40000,
        description: 'Health plan for seniors',
        duration_days: 365,
        premium: 0.0008,
        rating: 4.0,
        status: PolicyStatus.ACTIVE,
        popular: false,
        created_by: adminId,
      },
      {
        id: 9,
        name: 'Backpacker Travel',
        category: PolicyCategory.TRAVEL,
        coverage: 10000,
        description: 'Budget travel coverage',
        duration_days: 45,
        premium: 0.0009,
        rating: 3.8,
        status: PolicyStatus.ACTIVE,
        popular: false,
        created_by: adminId,
      },
      {
        id: 10,
        name: 'Crop Guard Max',
        category: PolicyCategory.CROP,
        coverage: 60000,
        description: 'Maximum crop protection',
        duration_days: 200,
        premium: 0.001,
        rating: 4.6,
        status: PolicyStatus.ACTIVE,
        popular: true,
        created_by: adminId,
      },
    ];

    const { error: policyError } = await supabase
      .from('policies')
      .upsert(policies, { onConflict: 'id' });

    if (policyError) {
      console.error('❌ Failed to seed policies:', policyError.message);
    } else {
      console.log('✅ Seeded policies');
    }
  }

  console.log('\n🎉 Seeding complete.');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
});
