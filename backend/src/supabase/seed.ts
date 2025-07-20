import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

// ENV: set in .env file
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

type RoleSeed = {
  id: string;
  name: string;
  description: string;
  color: string;
  settings: Record<string, any>;
  permissions: string[];
};

const roles: RoleSeed[] = [
  {
    id: 'policyholder',
    name: 'Policyholder',
    description: 'Users who purchase and manage insurance policies',
    color: 'from-blue-500 to-cyan-500',
    settings: {
      maxPolicies: 10,
      maxClaimsPerMonth: 5,
      requireTwoFactor: false,
      autoApprovalLimit: 1000,
    },
    permissions: [
      'view_policies',
      'purchase_policies',
      'submit_claims',
      'manage_profile',
      'view_wallet',
      'download_documents',
    ],
  },
  {
    id: 'insurance_admin',
    name: 'Insurance Admin',
    description: 'Admins who manage policies and claims',
    color: 'from-emerald-500 to-teal-500',
    settings: {
      maxClaimApproval: 50000,
      requireTwoFactor: true,
      sessionTimeout: 60,
      ipRestriction: false,
    },
    permissions: [
      'manage_policies',
      'review_claims',
      'view_reports',
      'manage_offers',
      'approve_claims',
      'access_analytics',
      'manage_customers',
      'export_data',
    ],
  },
];

const permissions = Array.from(
  new Set(roles.flatMap((r) => r.permissions)),
).map((id) => ({
  id,
  name: id.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
}));

const users = [
  {
    email: 'alex.johnson@example.com',
    password: 'Password123!',
    role: 'policyholder',
    profile: {
      status: 'active',
      kyc_status: 'verified',
      location: 'New York, USA',
      policies: 3,
      claims: 2,
      notes: 'Premium customer with excellent payment history',
    },
  },
  {
    email: 'sarah.chen@example.com',
    password: 'Password123!',
    role: 'insurance_admin',
    profile: {
      status: 'active',
      kyc_status: 'verified',
      location: 'California, USA',
      company: 'HealthSecure Insurance',
      notes: 'Senior reviewer',
    },
  },
];

async function seed() {
  console.log('🌱 Seeding roles and permissions...');

  await supabase.from('role_permissions').delete().neq('role_id', '');
  await supabase.from('permissions').delete().neq('id', '');
  await supabase.from('roles').delete().neq('id', '');

  await supabase.from('permissions').insert(permissions);

  await supabase.from('roles').insert(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    roles.map(({ permissions, ...role }) => ({
      ...role,
      settings: role.settings,
    })),
  );

  const rolePerms = roles.flatMap((role) =>
    role.permissions.map((pid) => ({
      role_id: role.id,
      permission_id: pid,
      enabled: true,
    })),
  );

  await supabase.from('role_permissions').insert(rolePerms);

  console.log('✅ Roles & permissions seeded.\n');

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

    await supabase.from('user_profiles').insert({
      user_id: data.user.id,
      role: user.role,
      join_date: new Date().toISOString().split('T')[0],
      ...user.profile,
    });

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
