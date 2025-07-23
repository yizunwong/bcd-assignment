export const profileData = {
  firstName: 'Alex',
  lastName: 'Johnson',
  email: 'alex.johnson@email.com',
  phone: '+1 (555) 123-4567',
  address: '123 Main Street, New York, NY 10001',
  dateOfBirth: '1990-05-15',
  occupation: 'Software Engineer',
  bio: 'Blockchain enthusiast and early adopter of decentralized insurance solutions.'
};

export const notifications = {
  emailClaims: true,
  emailPremiums: true,
  emailOffers: false,
  pushClaims: true,
  pushPremiums: true,
  pushOffers: false,
  smsUrgent: true
};

export const kycStatus = {
  identity: { status: 'verified', date: '2024-01-15' },
  address: { status: 'verified', date: '2024-01-15' },
  income: { status: 'pending', date: null },
  documents: { status: 'verified', date: '2024-01-16' }
};

export const activityLog = [
  { date: '2024-12-20', action: 'Submitted claim CL-002', type: 'claim' },
  { date: '2024-12-15', action: 'Premium payment processed', type: 'payment' },
  { date: '2024-12-10', action: 'Claim CL-001 approved', type: 'claim' },
  { date: '2024-12-01', action: 'Purchased Travel Insurance', type: 'policy' },
  { date: '2024-11-28', action: 'Profile updated', type: 'profile' }
];
