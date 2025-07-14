export const walletBalance = {
  eth: '5.2847',
  usd: '18,420.50',
  tokens: [
    { symbol: 'USDC', name: 'USD Coin', balance: '2,500.00', usdValue: '2,500.00' },
    { symbol: 'DAI', name: 'Dai Stablecoin', balance: '1,200.50', usdValue: '1,200.50' },
    { symbol: 'LINK', name: 'Chainlink', balance: '150.25', usdValue: '2,103.50' }
  ]
};

export const allTransactions = [
  {
    id: 'tx-001',
    type: 'received',
    amount: '160,000 USDC',
    description: 'Crop Insurance Payout',
    date: '2024-08-20',
    status: 'completed',
    hash: '0x1234...5678',
    from: 'AgriBlock Smart Contract'
  },
  {
    id: 'tx-002',
    type: 'sent',
    amount: '0.8 ETH',
    description: 'Health Insurance Premium',
    date: '2024-12-15',
    status: 'completed',
    hash: '0x2345...6789',
    to: 'HealthSecure Premium Pool'
  },
  {
    id: 'tx-003',
    type: 'received',
    amount: '2,500 USDC',
    description: 'Medical Claim Payout',
    date: '2024-12-13',
    status: 'completed',
    hash: '0x3456...7890',
    from: 'HealthSecure Claims Contract'
  },
  {
    id: 'tx-004',
    type: 'sent',
    amount: '0.2 ETH',
    description: 'Travel Insurance Premium',
    date: '2024-12-01',
    status: 'completed',
    hash: '0x4567...8901',
    to: 'TravelChain Premium Pool'
  },
  {
    id: 'tx-005',
    type: 'sent',
    amount: '2.5 ETH',
    description: 'Crop Insurance Premium',
    date: '2024-03-01',
    status: 'completed',
    hash: '0x5678...9012',
    to: 'AgriBlock Premium Pool'
  },
  {
    id: 'tx-006',
    type: 'received',
    amount: '8,500 USDC',
    description: 'Travel Emergency Claim Payout',
    date: '2024-11-16',
    status: 'completed',
    hash: '0x6789...0123',
    from: 'TravelChain Claims Contract'
  },
  {
    id: 'tx-007',
    type: 'sent',
    amount: '1.2 ETH',
    description: 'Family Health Premium',
    date: '2024-11-15',
    status: 'completed',
    hash: '0x7890...1234',
    to: 'FamilyCare Premium Pool'
  },
  {
    id: 'tx-008',
    type: 'received',
    amount: '45,000 USDC',
    description: 'Hail Damage Claim Payout',
    date: '2024-09-25',
    status: 'completed',
    hash: '0x8901...2345',
    from: 'AgriBlock Claims Contract'
  },
  {
    id: 'tx-009',
    type: 'sent',
    amount: '0.4 ETH',
    description: 'Student Health Premium',
    date: '2024-09-01',
    status: 'completed',
    hash: '0x9012...3456',
    to: 'StudentCare Premium Pool'
  },
  {
    id: 'tx-010',
    type: 'received',
    amount: '1,200 USDC',
    description: 'Lost Luggage Claim Payout',
    date: '2024-12-01',
    status: 'completed',
    hash: '0x0123...4567',
    from: 'TravelChain Claims Contract'
  },
  {
    id: 'tx-011',
    type: 'sent',
    amount: '0.6 ETH',
    description: 'Telehealth Plus Premium',
    date: '2024-10-15',
    status: 'completed',
    hash: '0x1234...5679',
    to: 'TeleHealth Premium Pool'
  },
  {
    id: 'tx-012',
    type: 'received',
    amount: '2,100 USDC',
    description: 'Physical Therapy Claim Payout',
    date: '2024-11-06',
    status: 'completed',
    hash: '0x2345...6780',
    from: 'HealthSecure Claims Contract'
  },
  {
    id: 'tx-013',
    type: 'sent',
    amount: '0.35 ETH',
    description: 'Cruise Travel Premium',
    date: '2024-08-10',
    status: 'completed',
    hash: '0x3456...7891',
    to: 'CruiseSecure Premium Pool'
  },
  {
    id: 'tx-014',
    type: 'received',
    amount: '800 USDC',
    description: 'Flight Delay Compensation',
    date: '2024-12-01',
    status: 'completed',
    hash: '0x4567...8902',
    from: 'TravelChain Claims Contract'
  },
  {
    id: 'tx-015',
    type: 'sent',
    amount: '1.0 ETH',
    description: 'Senior Health Premium',
    date: '2024-07-01',
    status: 'completed',
    hash: '0x5678...9013',
    to: 'ElderCare Premium Pool'
  },
  {
    id: 'tx-016',
    type: 'received',
    amount: '25,000 USDC',
    description: 'Emergency Evacuation Payout',
    date: '2024-09-13',
    status: 'completed',
    hash: '0x6789...0124',
    from: 'TravelChain Claims Contract'
  },
  {
    id: 'tx-017',
    type: 'sent',
    amount: '0.25 ETH',
    description: 'Digital Nomad Travel Premium',
    date: '2024-06-01',
    status: 'completed',
    hash: '0x7890...1235',
    to: 'NomadProtect Premium Pool'
  },
  {
    id: 'tx-018',
    type: 'received',
    amount: '650 USDC',
    description: 'Specialist Consultation Payout',
    date: '2024-12-16',
    status: 'pending',
    hash: '0x8901...2346',
    from: 'HealthSecure Claims Contract'
  },
  {
    id: 'tx-019',
    type: 'sent',
    amount: '2.2 ETH',
    description: 'Greenhouse Crop Premium',
    date: '2024-05-01',
    status: 'completed',
    hash: '0x9012...3457',
    to: 'GreenHouse Premium Pool'
  },
  {
    id: 'tx-020',
    type: 'received',
    amount: '1,500 USDC',
    description: 'Mental Health Claim Payout',
    date: '2024-12-03',
    status: 'pending',
    hash: '0x0123...4568',
    from: 'HealthSecure Claims Contract'
  },
  {
    id: 'tx-021',
    type: 'sent',
    amount: '0.8 ETH',
    description: 'Luxury Travel Premium',
    date: '2024-04-15',
    status: 'completed',
    hash: '0x1234...5680',
    to: 'LuxuryGuard Premium Pool'
  },
  {
    id: 'tx-022',
    type: 'received',
    amount: '28,000 USDC',
    description: 'Frost Damage Claim Payout',
    date: '2024-12-09',
    status: 'pending',
    hash: '0x2345...6781',
    from: 'AgriBlock Claims Contract'
  },
  {
    id: 'tx-023',
    type: 'sent',
    amount: '2.8 ETH',
    description: 'Aquaculture Insurance Premium',
    date: '2024-03-15',
    status: 'completed',
    hash: '0x3456...7892',
    to: 'AquaSecure Premium Pool'
  },
  {
    id: 'tx-024',
    type: 'received',
    amount: '15,000 USDC',
    description: 'Surgery Claim Payout',
    date: '2024-12-07',
    status: 'pending',
    hash: '0x4567...8903',
    from: 'HealthSecure Claims Contract'
  },
  {
    id: 'tx-025',
    type: 'sent',
    amount: '2.4 ETH',
    description: 'Vertical Farm Premium',
    date: '2024-02-01',
    status: 'completed',
    hash: '0x5678...9014',
    to: 'VerticalGrow Premium Pool'
  }
];
