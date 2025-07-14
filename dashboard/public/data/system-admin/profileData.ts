export const profileData = {
  firstName: 'David',
  lastName: 'Kim',
  email: 'david.kim@blocksecure.com',
  phone: '+82 2 1234 5678',
  address: '123 Tech District, Seoul, South Korea',
  dateOfBirth: '1988-03-15',
  position: 'Lead System Administrator',
  department: 'Platform Operations',
  employeeId: 'BS-SYS-001',
  company: 'BlockSecure',
  clearanceLevel: 'Level 5 - Full Access',
  bio: 'Senior system administrator with 10+ years experience in blockchain infrastructure and platform security.'
};

export const notifications = {
  emailSecurity: true,
  emailSystem: true,
  emailUsers: true,
  pushSecurity: true,
  pushSystem: true,
  pushUsers: false,
  smsEmergency: true
};

export const systemStats = {
  systemUptime: '99.8%',
  usersManaged: 3891,
  contractsDeployed: 24,
  securityIncidents: 0
};

export const activityLog = [
  { date: '2024-12-21', action: 'System monitoring check completed', type: 'system' },
  { date: '2024-12-21', action: 'User role permissions updated', type: 'user' },
  { date: '2024-12-20', action: 'Smart contract deployment verified', type: 'contract' },
  { date: '2024-12-20', action: 'Security audit completed', type: 'security' },
  { date: '2024-12-19', action: 'Database backup verified', type: 'system' }
];

export const systemPermissions = [
  { id: 'full_access', name: 'Full System Access', enabled: true },
  { id: 'user_management', name: 'User Management', enabled: true },
  { id: 'system_monitoring', name: 'System Monitoring', enabled: true },
  { id: 'smart_contracts', name: 'Smart Contract Management', enabled: true },
  { id: 'security_settings', name: 'Security Settings', enabled: true },
  { id: 'audit_logs', name: 'Audit Logs', enabled: true },
  { id: 'system_configuration', name: 'System Configuration', enabled: true },
  { id: 'backup_restore', name: 'Backup & Restore', enabled: true },
  { id: 'network_management', name: 'Network Management', enabled: true },
  { id: 'emergency_access', name: 'Emergency Access', enabled: true }
];

export const securitySettings = [
  { name: 'Two-Factor Authentication', status: 'enabled', critical: true },
  { name: 'IP Restriction', status: 'enabled', critical: true },
  { name: 'Session Timeout', value: '30 minutes', critical: false },
  { name: 'Audit Logging', status: 'enabled', critical: true },
  { name: 'Emergency Protocols', status: 'active', critical: true }
];
