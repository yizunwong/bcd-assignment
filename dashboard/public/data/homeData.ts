import {
  Shield,
  Users,
  Lock,
  Zap,
  Globe,
  DollarSign,
  FileText,
  Clock,
  Heart,
  Plane,
  Sprout
} from 'lucide-react';

export const roles = [
  {
    id: 'policyholder',
    title: 'Individual Coverage',
    description: 'Personal insurance solutions for individuals and families',
    icon: Shield,
    href: '/auth/register?role=policyholder',
    gradient: 'from-blue-500 to-teal-500',
    features: ['Health Insurance', 'Travel Protection', 'Personal Coverage']
  },
  {
    id: 'admin',
    title: 'Insurance Provider',
    description: 'Comprehensive platform for insurance companies and brokers',
    icon: Users,
    href: '/auth/register?role=admin',
    gradient: 'from-emerald-500 to-green-500',
    features: ['Policy Management', 'Claims Processing', 'Analytics Dashboard']
  }
];

export const features = [
  {
    icon: Lock,
    title: 'Blockchain Security',
    description: 'Immutable smart contracts ensure transparent and secure transactions with military-grade encryption'
  },
  {
    icon: Zap,
    title: 'Instant Payouts',
    description: 'Automated claim processing with instant ERC-20 token payments - no waiting weeks for approval'
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: 'Decentralized network provides worldwide coverage with 24/7 accessibility from anywhere'
  },
  {
    icon: DollarSign,
    title: 'Lower Costs',
    description: 'Eliminate intermediaries and reduce overhead costs by up to 40% compared to traditional insurance'
  },
  {
    icon: FileText,
    title: 'Transparent Claims',
    description: 'Every claim is recorded on the blockchain for complete transparency and audit trail'
  },
  {
    icon: Clock,
    title: 'Real-time Processing',
    description: 'Smart contracts automatically process claims based on predefined conditions and oracle data'
  }
];

export const insuranceTypes = [
  {
    icon: Heart,
    title: 'Health Insurance',
    description: 'Comprehensive medical coverage with global network',
    coverage: 'Up to $500K',
    premium: 'From 0.5 ETH/month'
  },
  {
    icon: Plane,
    title: 'Travel Insurance',
    description: 'Worldwide travel protection and emergency assistance',
    coverage: 'Up to $100K',
    premium: 'From 0.1 ETH/trip'
  },
  {
    icon: Sprout,
    title: 'Crop Insurance',
    description: 'Weather-based agricultural protection with IoT monitoring',
    coverage: 'Up to $1M',
    premium: 'From 1.5 ETH/season'
  }
];

export const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Digital Nomad',
    content: 'BlockSecure made getting travel insurance so simple. The instant payouts saved my trip when my flight was cancelled.',
    rating: 5,
    avatar: '👩‍💻'
  },
  {
    name: 'Michael Rodriguez',
    role: 'Farm Owner',
    content: 'The crop insurance with weather oracles is revolutionary. Automatic payouts based on real weather data - no paperwork hassles.',
    rating: 5,
    avatar: '👨‍🌾'
  },
  {
    name: 'Dr. Emily Watson',
    role: 'Healthcare Professional',
    content: 'As a doctor, I appreciate the transparency of blockchain-based health insurance. Claims are processed fairly and quickly.',
    rating: 5,
    avatar: '👩‍⚕️'
  }
];

export const stats = [
  { label: 'Active Policies', value: '50K+' },
  { label: 'Claims Processed', value: '$25M+' },
  { label: 'Countries Covered', value: '120+' },
  { label: 'Customer Satisfaction', value: '98%' }
];

export const navigationLinks = [
  { href: '#features', label: 'Features' },
  { href: '#insurance', label: 'Insurance Types' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#about', label: 'About' }
];
