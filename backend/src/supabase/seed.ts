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

type RoleSeed = Database['public']['Tables']['roles']['Insert'] & {
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

const permissions: Database['public']['Tables']['permissions']['Insert'][] =
  Array.from(new Set(roles.flatMap((r) => r.permissions))).map((id) => ({
    id,
    name: id.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
  }));

type SeedUser = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: RoleSeed['id'];
  policyholder?: Omit<
    Database['public']['Tables']['policyholder_details']['Insert'],
    'user_id'
  >;
  admin?: Omit<
    Database['public']['Tables']['admin_details']['Insert'],
    'user_id'
  >;
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
