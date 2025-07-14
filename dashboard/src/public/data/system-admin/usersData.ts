import { User, Shield, Crown } from 'lucide-react';

export const users = [
  {
    id: 'USR-001',
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    role: 'policyholder',
    status: 'active',
    lastLogin: '2024-12-20T10:30:00Z',
    joinDate: '2024-01-15',
    policies: 3,
    claims: 2,
    kycStatus: 'verified',
    location: 'New York, USA',
    loginAttempts: 0,
    twoFactorEnabled: true,
    notes: 'Premium customer with excellent payment history',
    activityLog: [
      { action: 'Login', timestamp: '2024-12-20T10:30:00Z', ip: '192.168.1.100' },
      { action: 'Policy Purchase', timestamp: '2024-12-19T14:22:00Z', ip: '192.168.1.100' },
      { action: 'Claim Submitted', timestamp: '2024-12-18T09:15:00Z', ip: '192.168.1.100' }
    ]
  },
  {
    id: 'USR-002',
    name: 'Sarah Chen',
    email: 'sarah.chen@healthsecure.com',
    phone: '+1 (555) 234-5678',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-12-21T09:15:00Z',
    joinDate: '2024-02-10',
    policies: 245,
    claims: 156,
    kycStatus: 'verified',
    location: 'California, USA',
    company: 'HealthSecure Insurance',
    loginAttempts: 0,
    twoFactorEnabled: true,
    notes: 'Senior claims reviewer with 5+ years experience',
    activityLog: [
      { action: 'Claims Review', timestamp: '2024-12-21T09:15:00Z', ip: '10.0.0.50' },
      { action: 'Policy Approval', timestamp: '2024-12-20T16:45:00Z', ip: '10.0.0.50' },
      { action: 'Report Generated', timestamp: '2024-12-20T11:30:00Z', ip: '10.0.0.50' }
    ]
  },
  {
    id: 'USR-003',
    name: 'Mike Rodriguez',
    email: 'mike.rodriguez@farmcorp.com',
    phone: '+1 (555) 345-6789',
    role: 'policyholder',
    status: 'active',
    lastLogin: '2024-12-19T14:22:00Z',
    joinDate: '2024-03-05',
    policies: 1,
    claims: 1,
    kycStatus: 'verified',
    location: 'Texas, USA',
    company: 'Farm Corp Ltd',
    loginAttempts: 0,
    twoFactorEnabled: false,
    notes: 'Agricultural business owner, seasonal policy holder',
    activityLog: [
      { action: 'Claim Payout Received', timestamp: '2024-12-19T14:22:00Z', ip: '203.0.113.45' },
      { action: 'Weather Alert Received', timestamp: '2024-12-18T06:00:00Z', ip: '203.0.113.45' }
    ]
  },
  {
    id: 'USR-004',
    name: 'Emily Watson',
    email: 'emily.watson@travelchain.com',
    phone: '+44 20 7946 0958',
    role: 'admin',
    status: 'pending',
    lastLogin: null,
    joinDate: '2024-12-15',
    policies: 0,
    claims: 0,
    kycStatus: 'pending',
    location: 'London, UK',
    company: 'TravelChain Insurance',
    loginAttempts: 0,
    twoFactorEnabled: false,
    notes: 'New admin account pending verification',
    activityLog: [
      { action: 'Account Created', timestamp: '2024-12-15T10:00:00Z', ip: '198.51.100.25' }
    ]
  },
  {
    id: 'USR-005',
    name: 'David Kim',
    email: 'david.kim@blocksecure.com',
    phone: '+82 2 1234 5678',
    role: 'system-admin',
    status: 'active',
    lastLogin: '2024-12-21T11:45:00Z',
    joinDate: '2024-01-01',
    policies: 0,
    claims: 0,
    kycStatus: 'verified',
    location: 'Seoul, South Korea',
    company: 'BlockSecure',
    loginAttempts: 0,
    twoFactorEnabled: true,
    notes: 'Lead system administrator with full platform access',
    activityLog: [
      { action: 'System Monitoring', timestamp: '2024-12-21T11:45:00Z', ip: '172.16.0.10' },
      { action: 'User Management', timestamp: '2024-12-21T10:30:00Z', ip: '172.16.0.10' },
      { action: 'Security Audit', timestamp: '2024-12-20T15:20:00Z', ip: '172.16.0.10' }
    ]
  },
  {
    id: 'USR-006',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@email.com',
    phone: '+1 (555) 456-7890',
    role: 'policyholder',
    status: 'suspended',
    lastLogin: '2024-12-10T16:30:00Z',
    joinDate: '2024-06-20',
    policies: 2,
    claims: 5,
    kycStatus: 'flagged',
    location: 'Florida, USA',
    loginAttempts: 3,
    twoFactorEnabled: false,
    notes: 'Account suspended due to suspicious claim activity. Under investigation.',
    activityLog: [
      { action: 'Account Suspended', timestamp: '2024-12-11T09:00:00Z', ip: 'System' },
      { action: 'Failed Login Attempt', timestamp: '2024-12-10T16:35:00Z', ip: '198.51.100.100' },
      { action: 'Claim Submitted', timestamp: '2024-12-10T16:30:00Z', ip: '198.51.100.100' }
    ]
  },
  // Add more users to demonstrate pagination
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `USR-${String(i + 7).padStart(3, '0')}`,
    name: `User ${i + 7}`,
    email: `user${i + 7}@example.com`,
    phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    role: ['policyholder', 'admin', 'system-admin'][Math.floor(Math.random() * 3)],
    status: ['active', 'pending', 'suspended'][Math.floor(Math.random() * 3)],
    lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    policies: Math.floor(Math.random() * 10),
    claims: Math.floor(Math.random() * 5),
    kycStatus: ['verified', 'pending', 'flagged'][Math.floor(Math.random() * 3)],
    location: ['New York, USA', 'California, USA', 'Texas, USA', 'Florida, USA'][Math.floor(Math.random() * 4)],
    loginAttempts: Math.floor(Math.random() * 4),
    twoFactorEnabled: Math.random() > 0.5,
    notes: `Sample user ${i + 7} for testing pagination`,
    activityLog: [
      { action: 'Login', timestamp: new Date().toISOString(), ip: '192.168.1.100' }
    ]
  }))
];

export const roles = [
  {
    id: 'policyholder',
    name: 'Policyholder',
    description: 'Individual users who purchase and manage insurance policies',
    permissions: [
      { id: 'view_policies', name: 'View Policies', enabled: true },
      { id: 'purchase_policies', name: 'Purchase Policies', enabled: true },
      { id: 'submit_claims', name: 'Submit Claims', enabled: true },
      { id: 'manage_profile', name: 'Manage Profile', enabled: true },
      { id: 'view_wallet', name: 'View Wallet', enabled: true },
      { id: 'download_documents', name: 'Download Documents', enabled: true }
    ],
    userCount: users.filter(u => u.role === 'policyholder').length,
    icon: User,
    color: 'from-blue-500 to-cyan-500',
    settings: {
      maxPolicies: 10,
      maxClaimsPerMonth: 5,
      requireTwoFactor: false,
      autoApprovalLimit: 1000
    }
  },
  {
    id: 'admin',
    name: 'Insurance Admin',
    description: 'Insurance company administrators who manage policies and claims',
    permissions: [
      { id: 'manage_policies', name: 'Manage Policies', enabled: true },
      { id: 'review_claims', name: 'Review Claims', enabled: true },
      { id: 'view_reports', name: 'View Reports', enabled: true },
      { id: 'manage_offers', name: 'Manage Offers', enabled: true },
      { id: 'approve_claims', name: 'Approve Claims', enabled: true },
      { id: 'access_analytics', name: 'Access Analytics', enabled: true },
      { id: 'manage_customers', name: 'Manage Customers', enabled: true },
      { id: 'export_data', name: 'Export Data', enabled: true }
    ],
    userCount: users.filter(u => u.role === 'admin').length,
    icon: Shield,
    color: 'from-emerald-500 to-teal-500',
    settings: {
      maxClaimApproval: 50000,
      requireTwoFactor: true,
      sessionTimeout: 60,
      ipRestriction: false
    }
  },
  {
    id: 'system-admin',
    name: 'System Administrator',
    description: 'Platform administrators with full system access',
    permissions: [
      { id: 'full_access', name: 'Full System Access', enabled: true },
      { id: 'user_management', name: 'User Management', enabled: true },
      { id: 'system_monitoring', name: 'System Monitoring', enabled: true },
      { id: 'smart_contracts', name: 'Smart Contract Management', enabled: true },
      { id: 'security_settings', name: 'Security Settings', enabled: true },
      { id: 'audit_logs', name: 'Audit Logs', enabled: true },
      { id: 'system_configuration', name: 'System Configuration', enabled: true },
      { id: 'backup_restore', name: 'Backup & Restore', enabled: true }
    ],
    userCount: users.filter(u => u.role === 'system-admin').length,
    icon: Crown,
    color: 'from-purple-500 to-indigo-500',
    settings: {
      requireTwoFactor: true,
      sessionTimeout: 30,
      ipRestriction: true,
      auditLogging: true
    }
  }
];
