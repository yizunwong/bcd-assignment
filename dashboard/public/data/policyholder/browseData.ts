import { Heart, Plane, Sprout } from 'lucide-react';

export const policyCategories = [
  { id: 'health', name: 'Health Insurance', icon: Heart, color: 'from-red-500 to-pink-500' },
  { id: 'travel', name: 'Travel Insurance', icon: Plane, color: 'from-blue-500 to-cyan-500' },
  { id: 'crop', name: 'Crop Insurance', icon: Sprout, color: 'from-green-500 to-emerald-500' }
];

export const policies = [
  {
    id: 1,
    name: 'Comprehensive Health Coverage',
    category: 'health',
    provider: 'HealthSecure',
    coverage: '$100,000',
    premium: '0.8 ETH/month',
    rating: 4.8,
    features: ['Emergency Care', 'Prescription Drugs', 'Mental Health', 'Dental'],
    popular: true,
    description: 'Complete healthcare coverage with blockchain-verified claims processing',
    documents: [
      { name: 'Policy Terms', url: '#' },
      { name: 'Coverage Details', url: '#' }
    ],
    reviews: [
      { user: 'Alice', rating: 5, comment: 'Excellent coverage and service.' },
      { user: 'Bob', rating: 4, comment: 'Good value for the price.' }
    ]
  },
  {
    id: 2,
    name: 'Global Travel Protection',
    category: 'travel',
    provider: 'TravelChain',
    coverage: '$50,000',
    premium: '0.2 ETH/trip',
    rating: 4.6,
    features: ['Trip Cancellation', 'Medical Emergency', 'Lost Luggage', '24/7 Support'],
    popular: false,
    description: 'Worldwide travel insurance with instant claim verification',
    documents: [{ name: 'Policy Overview', url: '#' }],
    reviews: [
      { user: 'Jane', rating: 4, comment: 'Very handy for frequent travelers.' }
    ]
  },
  {
    id: 3,
    name: 'Weather-Based Crop Insurance',
    category: 'crop',
    provider: 'AgriBlock',
    coverage: '$200,000',
    premium: '2.5 ETH/season',
    rating: 4.9,
    features: ['Weather Oracle', 'Yield Protection', 'Automated Payouts', 'Satellite Monitoring'],
    popular: true,
    description: 'Smart contract insurance using IoT and weather data',
    documents: [{ name: 'Policy Terms', url: '#' }]
  },
  {
    id: 4,
    name: 'Premium Health Plus',
    category: 'health',
    provider: 'MediChain',
    coverage: '$250,000',
    premium: '1.5 ETH/month',
    rating: 4.7,
    features: ['Specialized Care', 'International Coverage', 'Wellness Programs', 'Telemedicine'],
    popular: false,
    description: 'Premium healthcare with global coverage and wellness benefits'
  },
  {
    id: 5,
    name: 'Business Travel Elite',
    category: 'travel',
    provider: 'CorpSecure',
    coverage: '$100,000',
    premium: '0.5 ETH/trip',
    rating: 4.5,
    features: ['Business Equipment', 'Meeting Cancellation', 'Executive Protection', 'Concierge'],
    popular: false,
    description: 'Executive travel insurance for business professionals'
  },
  {
    id: 6,
    name: 'Organic Crop Protection',
    category: 'crop',
    provider: 'GreenChain',
    coverage: '$150,000',
    premium: '1.8 ETH/season',
    rating: 4.8,
    features: ['Organic Certification', 'Pest Protection', 'Quality Guarantee', 'Market Price Shield'],
    popular: true,
    description: 'Specialized insurance for organic farming operations'
  },
  {
    id: 7,
    name: 'Family Health Shield',
    category: 'health',
    provider: 'FamilyCare',
    coverage: '$300,000',
    premium: '1.2 ETH/month',
    rating: 4.6,
    features: ['Family Coverage', 'Pediatric Care', 'Maternity Benefits', 'Preventive Care'],
    popular: false,
    description: 'Comprehensive family health insurance with pediatric focus'
  },
  {
    id: 8,
    name: 'Adventure Travel Coverage',
    category: 'travel',
    provider: 'AdventureSecure',
    coverage: '$75,000',
    premium: '0.3 ETH/trip',
    rating: 4.4,
    features: ['Extreme Sports', 'Mountain Rescue', 'Equipment Coverage', 'Emergency Evacuation'],
    popular: false,
    description: 'Specialized coverage for adventure and extreme sports travel'
  },
  {
    id: 9,
    name: 'Livestock Protection Plan',
    category: 'crop',
    provider: 'RanchGuard',
    coverage: '$500,000',
    premium: '3.0 ETH/season',
    rating: 4.7,
    features: ['Disease Coverage', 'Theft Protection', 'Feed Cost Insurance', 'Veterinary Care'],
    popular: true,
    description: 'Comprehensive livestock and ranch protection insurance'
  },
  {
    id: 10,
    name: 'Senior Health Care',
    category: 'health',
    provider: 'ElderCare',
    coverage: '$200,000',
    premium: '1.0 ETH/month',
    rating: 4.9,
    features: ['Senior Specialists', 'Long-term Care', 'Home Health', 'Prescription Coverage'],
    popular: false,
    description: 'Specialized health insurance designed for seniors'
  },
  {
    id: 11,
    name: 'Digital Nomad Travel',
    category: 'travel',
    provider: 'NomadProtect',
    coverage: '$60,000',
    premium: '0.25 ETH/month',
    rating: 4.5,
    features: ['Global Coverage', 'Work Equipment', 'Visa Assistance', 'Remote Work Support'],
    popular: true,
    description: 'Travel insurance tailored for digital nomads and remote workers'
  },
  {
    id: 12,
    name: 'Greenhouse Crop Insurance',
    category: 'crop',
    provider: 'GreenHouse Pro',
    coverage: '$180,000',
    premium: '2.2 ETH/season',
    rating: 4.6,
    features: ['Climate Control', 'Pest Management', 'Equipment Coverage', 'Yield Guarantee'],
    popular: false,
    description: 'Specialized insurance for greenhouse and controlled environment agriculture'
  },
  {
    id: 13,
    name: 'Student Health Plan',
    category: 'health',
    provider: 'StudentCare',
    coverage: '$75,000',
    premium: '0.4 ETH/month',
    rating: 4.3,
    features: ['Campus Health', 'Mental Health', 'Sports Injuries', 'Prescription Drugs'],
    popular: false,
    description: 'Affordable health insurance designed for students'
  },
  {
    id: 14,
    name: 'Luxury Travel Protection',
    category: 'travel',
    provider: 'LuxuryGuard',
    coverage: '$200,000',
    premium: '0.8 ETH/trip',
    rating: 4.8,
    features: ['Concierge Service', 'Private Medical', 'Luxury Transport', 'VIP Support'],
    popular: true,
    description: 'Premium travel insurance for luxury and high-end travel'
  },
  {
    id: 15,
    name: 'Aquaculture Insurance',
    category: 'crop',
    provider: 'AquaSecure',
    coverage: '$400,000',
    premium: '2.8 ETH/season',
    rating: 4.4,
    features: ['Fish Mortality', 'Equipment Coverage', 'Water Quality', 'Disease Protection'],
    popular: false,
    description: 'Comprehensive insurance for aquaculture and fish farming operations'
  },
  {
    id: 16,
    name: 'Telehealth Plus',
    category: 'health',
    provider: 'TeleHealth Pro',
    coverage: '$120,000',
    premium: '0.6 ETH/month',
    rating: 4.5,
    features: ['24/7 Telehealth', 'Remote Monitoring', 'Digital Prescriptions', 'AI Diagnostics'],
    popular: false,
    description: 'Modern health insurance focused on telehealth and digital care'
  },
  {
    id: 17,
    name: 'Cruise Travel Insurance',
    category: 'travel',
    provider: 'CruiseSecure',
    coverage: '$80,000',
    premium: '0.35 ETH/trip',
    rating: 4.6,
    features: ['Shore Excursions', 'Cabin Coverage', 'Medical at Sea', 'Trip Interruption'],
    popular: false,
    description: 'Specialized travel insurance for cruise vacations'
  },
  {
    id: 18,
    name: 'Vertical Farm Coverage',
    category: 'crop',
    provider: 'VerticalGrow',
    coverage: '$250,000',
    premium: '2.4 ETH/season',
    rating: 4.7,
    features: ['LED Systems', 'Hydroponic Equipment', 'Climate Control', 'Automation Coverage'],
    popular: true,
    description: 'Insurance for vertical farming and indoor agriculture systems'
  }
];
