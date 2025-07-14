export const allPolicies = [
    {
      id: 'POL-001',
      name: 'Comprehensive Health Coverage',
      type: 'Health',
      provider: 'HealthSecure',
      coverage: '$100,000',
      premium: '0.8 ETH/month',
      status: 'Active',
      startDate: '2024-01-15',
      endDate: '2025-01-15',
      nextPayment: '2025-02-15',
      utilizationRate: 35,
      claimsUsed: '$35,000',
      benefits: ['Emergency Care', 'Prescription Drugs', 'Mental Health', 'Dental Care', 'Vision Care'],
      recentClaims: [
        { date: '2024-12-10', amount: '$2,500', status: 'approved', description: 'Emergency Room Visit' },
        { date: '2024-11-22', amount: '$450', status: 'approved', description: 'Prescription Medication' }
      ]
    },
    {
      id: 'POL-002',
      name: 'Global Travel Protection',
      type: 'Travel',
      provider: 'TravelChain',
      coverage: '$50,000',
      premium: '0.2 ETH/trip',
      status: 'Active',
      startDate: '2024-12-01',
      endDate: '2025-06-01',
      nextPayment: 'Per Trip',
      utilizationRate: 0,
      claimsUsed: '$0',
      benefits: ['Trip Cancellation', 'Medical Emergency', 'Lost Luggage', '24/7 Support', 'Flight Delay'],
      recentClaims: []
    },
    {
      id: 'POL-003',
      name: 'Weather-Based Crop Insurance',
      type: 'Crop',
      provider: 'AgriBlock',
      coverage: '$200,000',
      premium: '2.5 ETH/season',
      status: 'Claimed',
      startDate: '2024-03-01',
      endDate: '2024-11-30',
      nextPayment: 'Season Ended',
      utilizationRate: 80,
      claimsUsed: '$160,000',
      benefits: ['Weather Oracle', 'Yield Protection', 'Automated Payouts', 'Satellite Monitoring'],
      recentClaims: [
        { date: '2024-08-15', amount: '$160,000', status: 'approved', description: 'Drought Damage Claim' }
      ]
    },
    {
      id: 'POL-004',
      name: 'Family Health Shield',
      type: 'Health',
      provider: 'FamilyCare',
      coverage: '$300,000',
      premium: '1.2 ETH/month',
      status: 'Active',
      startDate: '2024-06-01',
      endDate: '2025-06-01',
      nextPayment: '2025-01-01',
      utilizationRate: 15,
      claimsUsed: '$45,000',
      benefits: ['Family Coverage', 'Pediatric Care', 'Maternity Benefits', 'Preventive Care'],
      recentClaims: [
        { date: '2024-11-15', amount: '$1,200', status: 'approved', description: 'Pediatric Checkup' }
      ]
    },
    {
      id: 'POL-005',
      name: 'Digital Nomad Travel',
      type: 'Travel',
      provider: 'NomadProtect',
      coverage: '$60,000',
      premium: '0.25 ETH/month',
      status: 'Active',
      startDate: '2024-09-01',
      endDate: '2025-09-01',
      nextPayment: '2025-01-01',
      utilizationRate: 8,
      claimsUsed: '$4,800',
      benefits: ['Global Coverage', 'Work Equipment', 'Visa Assistance', 'Remote Work Support'],
      recentClaims: [
        { date: '2024-10-20', amount: '$800', status: 'approved', description: 'Equipment Replacement' }
      ]
    },
    {
      id: 'POL-006',
      name: 'Senior Health Care',
      type: 'Health',
      provider: 'ElderCare',
      coverage: '$200,000',
      premium: '1.0 ETH/month',
      status: 'Expired',
      startDate: '2023-07-01',
      endDate: '2024-07-01',
      nextPayment: 'Expired',
      utilizationRate: 65,
      claimsUsed: '$130,000',
      benefits: ['Senior Specialists', 'Long-term Care', 'Home Health', 'Prescription Coverage'],
      recentClaims: [
        { date: '2024-06-15', amount: '$5,200', status: 'approved', description: 'Specialist Treatment' }
      ]
    },
    {
      id: 'POL-007',
      name: 'Student Health Plan',
      type: 'Health',
      provider: 'StudentCare',
      coverage: '$75,000',
      premium: '0.4 ETH/month',
      status: 'Active',
      startDate: '2024-08-01',
      endDate: '2025-08-01',
      nextPayment: '2025-01-01',
      utilizationRate: 12,
      claimsUsed: '$9,000',
      benefits: ['Campus Health', 'Mental Health', 'Sports Injuries', 'Prescription Drugs'],
      recentClaims: [
        { date: '2024-11-05', amount: '$350', status: 'approved', description: 'Campus Health Visit' }
      ]
    },
    {
      id: 'POL-008',
      name: 'Luxury Travel Protection',
      type: 'Travel',
      provider: 'LuxuryGuard',
      coverage: '$200,000',
      premium: '0.8 ETH/trip',
      status: 'Active',
      startDate: '2024-04-15',
      endDate: '2025-04-15',
      nextPayment: 'Per Trip',
      utilizationRate: 25,
      claimsUsed: '$50,000',
      benefits: ['Concierge Service', 'Private Medical', 'Luxury Transport', 'VIP Support'],
      recentClaims: [
        { date: '2024-09-10', amount: '$25,000', status: 'approved', description: 'Emergency Evacuation' }
      ]
    },
    {
      id: 'POL-009',
      name: 'Telehealth Plus',
      type: 'Health',
      provider: 'TeleHealth Pro',
      coverage: '$120,000',
      premium: '0.6 ETH/month',
      status: 'Suspended',
      startDate: '2024-10-01',
      endDate: '2025-10-01',
      nextPayment: 'Payment Overdue',
      utilizationRate: 5,
      claimsUsed: '$6,000',
      benefits: ['24/7 Telehealth', 'Remote Monitoring', 'Digital Prescriptions', 'AI Diagnostics'],
      recentClaims: [
        { date: '2024-11-20', amount: '$150', status: 'approved', description: 'Telehealth Consultation' }
      ]
    },
    {
      id: 'POL-010',
      name: 'Vertical Farm Coverage',
      type: 'Crop',
      provider: 'VerticalGrow',
      coverage: '$250,000',
      premium: '2.4 ETH/season',
      status: 'Active',
      startDate: '2024-02-01',
      endDate: '2024-12-31',
      nextPayment: '2025-02-01',
      utilizationRate: 0,
      claimsUsed: '$0',
      benefits: ['LED Systems', 'Hydroponic Equipment', 'Climate Control', 'Automation Coverage'],
      recentClaims: []
    },
    {
      id: 'POL-011',
      name: 'Adventure Travel Coverage',
      type: 'Travel',
      provider: 'AdventureSecure',
      coverage: '$75,000',
      premium: '0.3 ETH/trip',
      status: 'Active',
      startDate: '2024-05-01',
      endDate: '2025-05-01',
      nextPayment: 'Per Trip',
      utilizationRate: 40,
      claimsUsed: '$30,000',
      benefits: ['Extreme Sports', 'Mountain Rescue', 'Equipment Coverage', 'Emergency Evacuation'],
      recentClaims: [
        { date: '2024-08-22', amount: '$12,000', status: 'approved', description: 'Mountain Rescue' }
      ]
    },
    {
      id: 'POL-012',
      name: 'Livestock Protection Plan',
      type: 'Crop',
      provider: 'RanchGuard',
      coverage: '$500,000',
      premium: '3.0 ETH/season',
      status: 'Active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      nextPayment: '2025-01-01',
      utilizationRate: 18,
      claimsUsed: '$90,000',
      benefits: ['Disease Coverage', 'Theft Protection', 'Feed Cost Insurance', 'Veterinary Care'],
      recentClaims: [
        { date: '2024-09-30', amount: '$15,000', status: 'approved', description: 'Veterinary Treatment' }
      ]
    }
];
