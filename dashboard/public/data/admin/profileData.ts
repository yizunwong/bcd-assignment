export const profileData = {
  firstName: 'Sarah',
  lastName: 'Chen',
  email: 'sarah.chen@healthsecure.com',
  phone: '+1 (555) 234-5678',
  address: '456 Insurance Ave, San Francisco, CA 94102',
  dateOfBirth: '1985-08-22',
  position: 'Senior Claims Manager',
  department: 'Claims Processing',
  employeeId: 'HS-2024-001',
  company: 'HealthSecure Insurance',
  licenseNumber: 'INS-CA-789456',
  bio: 'Experienced insurance professional with 8+ years in claims management and policy administration.'
};

export const notifications = {
  emailClaims: true,
  emailPolicies: true,
  emailReports: true,
  pushClaims: true,
  pushPolicies: true,
  pushReports: false,
  smsUrgent: true
};

export const adminStats = {
  claimsReviewed: 1247,
  policiesManaged: 245,
  reportsGenerated: 89,
  avgProcessingTime: '2.3 days'
};

export const activityLog = [
  { date: '2024-12-21', action: 'Approved claim CL-156', type: 'claim' },
  { date: '2024-12-21', action: 'Generated monthly report', type: 'report' },
  { date: '2024-12-20', action: 'Reviewed policy POL-089', type: 'policy' },
  { date: '2024-12-20', action: 'Updated seasonal offer', type: 'offer' },
  { date: '2024-12-19', action: 'Processed bulk claims', type: 'claim' }
];

export const permissions = [
  { id: 'manage_policies', name: 'Manage Policies', enabled: true },
  { id: 'review_claims', name: 'Review Claims', enabled: true },
  { id: 'view_reports', name: 'View Reports', enabled: true },
  { id: 'manage_offers', name: 'Manage Offers', enabled: true },
  { id: 'approve_claims', name: 'Approve Claims', enabled: true },
  { id: 'access_analytics', name: 'Access Analytics', enabled: true },
  { id: 'manage_customers', name: 'Manage Customers', enabled: false },
  { id: 'export_data', name: 'Export Data', enabled: true }
];
