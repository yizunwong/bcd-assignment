import { Heart, Plane, Sprout, Shield } from 'lucide-react';

export const policies = [
    {
      id: 'POL-001',
      name: 'Comprehensive Health Coverage',
      category: 'health',
      provider: 'HealthSecure',
      coverage: '$100,000',
      premium: '0.8 ETH/month',
      status: 'active',
      sales: 245,
      revenue: '196 ETH',
      created: '2024-01-15',
      lastUpdated: '2024-11-20',
      description: 'Complete healthcare coverage with blockchain-verified claims processing',
      features: ['Emergency Care', 'Prescription Drugs', 'Mental Health', 'Dental Care', 'Vision Care'],
      terms: 'Standard health insurance terms with 30-day waiting period for pre-existing conditions.'
    },
    {
      id: 'POL-002',
      name: 'Global Travel Protection',
      category: 'travel',
      provider: 'TravelChain',
      coverage: '$50,000',
      premium: '0.2 ETH/trip',
      status: 'active',
      sales: 189,
      revenue: '37.8 ETH',
      created: '2024-02-10',
      lastUpdated: '2024-12-01',
      description: 'Worldwide travel insurance with instant claim verification',
      features: ['Trip Cancellation', 'Medical Emergency', 'Lost Luggage', '24/7 Support', 'Flight Delay'],
      terms: 'Coverage begins 24 hours after purchase. Maximum trip duration 90 days.'
    },
    {
      id: 'POL-003',
      name: 'Weather-Based Crop Insurance',
      category: 'crop',
      provider: 'AgriBlock',
      coverage: '$200,000',
      premium: '2.5 ETH/season',
      status: 'active',
      sales: 156,
      revenue: '390 ETH',
      created: '2024-03-01',
      lastUpdated: '2024-10-15',
      description: 'Smart contract insurance using IoT and weather data',
      features: ['Weather Oracle', 'Yield Protection', 'Automated Payouts', 'Satellite Monitoring'],
      terms: 'Coverage based on weather oracle data. Automatic payouts triggered by predefined conditions.'
    },
    {
      id: 'POL-004',
      name: 'Premium Health Plus',
      category: 'health',
      provider: 'MediChain',
      coverage: '$250,000',
      premium: '1.5 ETH/month',
      status: 'draft',
      sales: 0,
      revenue: '0 ETH',
      created: '2024-12-01',
      lastUpdated: '2024-12-15',
      description: 'Premium healthcare with global coverage and wellness benefits',
      features: ['Specialized Care', 'International Coverage', 'Wellness Programs', 'Telemedicine'],
      terms: 'Premium tier with enhanced benefits and global coverage network.'
    },
    {
      id: 'POL-005',
      name: 'Family Health Shield',
      category: 'health',
      provider: 'FamilyCare',
      coverage: '$300,000',
      premium: '1.2 ETH/month',
      status: 'active',
      sales: 98,
      revenue: '117.6 ETH',
      created: '2024-06-01',
      lastUpdated: '2024-11-30',
      description: 'Comprehensive family health insurance with pediatric focus',
      features: ['Family Coverage', 'Pediatric Care', 'Maternity Benefits', 'Preventive Care'],
      terms: 'Family coverage for up to 6 members with comprehensive pediatric benefits.'
    },
    {
      id: 'POL-006',
      name: 'Business Travel Elite',
      category: 'travel',
      provider: 'CorpSecure',
      coverage: '$100,000',
      premium: '0.5 ETH/trip',
      status: 'active',
      sales: 67,
      revenue: '33.5 ETH',
      created: '2024-04-15',
      lastUpdated: '2024-11-25',
      description: 'Executive travel insurance for business professionals',
      features: ['Business Equipment', 'Meeting Cancellation', 'Executive Protection', 'Concierge'],
      terms: 'Premium business travel coverage with executive-level benefits and support.'
    },
    {
      id: 'POL-007',
      name: 'Organic Crop Protection',
      category: 'crop',
      provider: 'GreenChain',
      coverage: '$150,000',
      premium: '1.8 ETH/season',
      status: 'active',
      sales: 89,
      revenue: '160.2 ETH',
      created: '2024-05-20',
      lastUpdated: '2024-10-30',
      description: 'Specialized insurance for organic farming operations',
      features: ['Organic Certification', 'Pest Protection', 'Quality Guarantee', 'Market Price Shield'],
      terms: 'Organic farming insurance with certification protection and quality guarantees.'
    },
    {
      id: 'POL-008',
      name: 'Senior Health Care',
      category: 'health',
      provider: 'ElderCare',
      coverage: '$200,000',
      premium: '1.0 ETH/month',
      status: 'active',
      sales: 134,
      revenue: '134 ETH',
      created: '2024-03-10',
      lastUpdated: '2024-11-15',
      description: 'Specialized health insurance designed for seniors',
      features: ['Senior Specialists', 'Long-term Care', 'Home Health', 'Prescription Coverage'],
      terms: 'Senior-focused health insurance with specialized care and long-term benefits.'
    },
    {
      id: 'POL-009',
      name: 'Adventure Travel Coverage',
      category: 'travel',
      provider: 'AdventureSecure',
      coverage: '$75,000',
      premium: '0.3 ETH/trip',
      status: 'active',
      sales: 45,
      revenue: '13.5 ETH',
      created: '2024-07-01',
      lastUpdated: '2024-11-10',
      description: 'Specialized coverage for adventure and extreme sports travel',
      features: ['Extreme Sports', 'Mountain Rescue', 'Equipment Coverage', 'Emergency Evacuation'],
      terms: 'Adventure travel insurance covering extreme sports and high-risk activities.'
    },
    {
      id: 'POL-010',
      name: 'Livestock Protection Plan',
      category: 'crop',
      provider: 'RanchGuard',
      coverage: '$500,000',
      premium: '3.0 ETH/season',
      status: 'active',
      sales: 23,
      revenue: '69 ETH',
      created: '2024-08-15',
      lastUpdated: '2024-11-05',
      description: 'Comprehensive livestock and ranch protection insurance',
      features: ['Disease Coverage', 'Theft Protection', 'Feed Cost Insurance', 'Veterinary Care'],
      terms: 'Livestock insurance covering disease, theft, and operational risks.'
    },
    {
      id: 'POL-011',
      name: 'Digital Nomad Travel',
      category: 'travel',
      provider: 'NomadProtect',
      coverage: '$60,000',
      premium: '0.25 ETH/month',
      status: 'active',
      sales: 78,
      revenue: '19.5 ETH',
      created: '2024-09-01',
      lastUpdated: '2024-12-01',
      description: 'Travel insurance tailored for digital nomads and remote workers',
      features: ['Global Coverage', 'Work Equipment', 'Visa Assistance', 'Remote Work Support'],
      terms: 'Digital nomad insurance with global coverage and remote work protection.'
    },
    {
      id: 'POL-012',
      name: 'Student Health Plan',
      category: 'health',
      provider: 'StudentCare',
      coverage: '$75,000',
      premium: '0.4 ETH/month',
      status: 'active',
      sales: 156,
      revenue: '62.4 ETH',
      created: '2024-08-01',
      lastUpdated: '2024-11-20',
      description: 'Affordable health insurance designed for students',
      features: ['Campus Health', 'Mental Health', 'Sports Injuries', 'Prescription Drugs'],
      terms: 'Student health insurance with campus-specific benefits and mental health support.'
    },
    {
      id: 'POL-013',
      name: 'Greenhouse Crop Insurance',
      category: 'crop',
      provider: 'GreenHouse Pro',
      coverage: '$180,000',
      premium: '2.2 ETH/season',
      status: 'active',
      sales: 34,
      revenue: '74.8 ETH',
      created: '2024-04-01',
      lastUpdated: '2024-10-20',
      description: 'Specialized insurance for greenhouse and controlled environment agriculture',
      features: ['Climate Control', 'Pest Management', 'Equipment Coverage', 'Yield Guarantee'],
      terms: 'Greenhouse agriculture insurance with climate control and equipment protection.'
    },
    {
      id: 'POL-014',
      name: 'Luxury Travel Protection',
      category: 'travel',
      provider: 'LuxuryGuard',
      coverage: '$200,000',
      premium: '0.8 ETH/trip',
      status: 'active',
      sales: 29,
      revenue: '23.2 ETH',
      created: '2024-06-15',
      lastUpdated: '2024-11-28',
      description: 'Premium travel insurance for luxury and high-end travel',
      features: ['Concierge Service', 'Private Medical', 'Luxury Transport', 'VIP Support'],
      terms: 'Luxury travel insurance with premium services and VIP support.'
    },
    {
      id: 'POL-015',
      name: 'Aquaculture Insurance',
      category: 'crop',
      provider: 'AquaSecure',
      coverage: '$400,000',
      premium: '2.8 ETH/season',
      status: 'active',
      sales: 18,
      revenue: '50.4 ETH',
      created: '2024-05-01',
      lastUpdated: '2024-10-25',
      description: 'Comprehensive insurance for aquaculture and fish farming operations',
      features: ['Fish Mortality', 'Equipment Coverage', 'Water Quality', 'Disease Protection'],
      terms: 'Aquaculture insurance covering fish mortality and operational risks.'
    },
    {
      id: 'POL-016',
      name: 'Telehealth Plus',
      category: 'health',
      provider: 'TeleHealth Pro',
      coverage: '$120,000',
      premium: '0.6 ETH/month',
      status: 'draft',
      sales: 0,
      revenue: '0 ETH',
      created: '2024-11-01',
      lastUpdated: '2024-12-10',
      description: 'Modern health insurance focused on telehealth and digital care',
      features: ['24/7 Telehealth', 'Remote Monitoring', 'Digital Prescriptions', 'AI Diagnostics'],
      terms: 'Telehealth-focused insurance with digital care and remote monitoring.'
    },
    {
      id: 'POL-017',
      name: 'Cruise Travel Insurance',
      category: 'travel',
      provider: 'CruiseSecure',
      coverage: '$80,000',
      premium: '0.35 ETH/trip',
      status: 'active',
      sales: 52,
      revenue: '18.2 ETH',
      created: '2024-07-15',
      lastUpdated: '2024-11-12',
      description: 'Specialized travel insurance for cruise vacations',
      features: ['Shore Excursions', 'Cabin Coverage', 'Medical at Sea', 'Trip Interruption'],
      terms: 'Cruise travel insurance with specialized maritime coverage.'
    },
    {
      id: 'POL-018',
      name: 'Vertical Farm Coverage',
      category: 'crop',
      provider: 'VerticalGrow',
      coverage: '$250,000',
      premium: '2.4 ETH/season',
      status: 'active',
      sales: 12,
      revenue: '28.8 ETH',
      created: '2024-09-15',
      lastUpdated: '2024-12-05',
      description: 'Insurance for vertical farming and indoor agriculture systems',
      features: ['LED Systems', 'Hydroponic Equipment', 'Climate Control', 'Automation Coverage'],
      terms: 'Vertical farming insurance with technology and automation protection.'
    },
    {
      id: 'POL-019',
      name: 'Emergency Health Response',
      category: 'health',
      provider: 'EmergencyMed',
      coverage: '$150,000',
      premium: '0.9 ETH/month',
      status: 'draft',
      sales: 0,
      revenue: '0 ETH',
      created: '2024-11-15',
      lastUpdated: '2024-12-08',
      description: 'Rapid response health insurance for emergency situations',
      features: ['Emergency Response', 'Ambulance Service', 'Trauma Care', 'Critical Care'],
      terms: 'Emergency health insurance with rapid response and trauma care.'
    },
    {
      id: 'POL-020',
      name: 'International Business Travel',
      category: 'travel',
      provider: 'GlobalBiz',
      coverage: '$120,000',
      premium: '0.45 ETH/trip',
      status: 'active',
      sales: 38,
      revenue: '17.1 ETH',
      created: '2024-08-01',
      lastUpdated: '2024-11-18',
      description: 'Comprehensive international business travel insurance',
      features: ['Global Coverage', 'Business Interruption', 'Equipment Protection', 'Legal Assistance'],
      terms: 'International business travel insurance with comprehensive global coverage.'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'health': return Heart;
      case 'travel': return Plane;
      case 'crop': return Sprout;
      default: return Shield;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return 'from-red-500 to-pink-500';
      case 'travel': return 'from-blue-500 to-cyan-500';
      case 'crop': return 'from-green-500 to-emerald-500';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'draft': return 'status-pending';
      case 'inactive': return 'bg-slate-100 text-slate-800 dark:bg-slate-700/50 dark:text-slate-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700/50 dark:text-slate-300';
    }
  };

export { getCategoryIcon, getCategoryColor, getStatusColor };
