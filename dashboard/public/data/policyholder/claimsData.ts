export const claims = [
  {
    id: 'CL-001',
    policyId: 'POL-001',
    policyName: 'Comprehensive Health Coverage',
    type: 'Medical Expense',
    amount: '$2,500',
    status: 'approved',
    submittedDate: '2024-12-10',
    processedDate: '2024-12-12',
    description: 'Emergency room visit for chest pain',
    documents: ['medical_report.pdf', 'receipt.pdf'],
    timeline: [
      { step: 'Submitted', date: '2024-12-10', status: 'completed' },
      { step: 'Under Review', date: '2024-12-11', status: 'completed' },
      { step: 'Approved', date: '2024-12-12', status: 'completed' },
      { step: 'Payment Processed', date: '2024-12-13', status: 'completed' }
    ]
  },
  {
    id: 'CL-002',
    policyId: 'POL-001',
    policyName: 'Comprehensive Health Coverage',
    type: 'Prescription',
    amount: '$450',
    status: 'pending',
    submittedDate: '2024-12-20',
    processedDate: null,
    description: 'Monthly prescription medication refill',
    documents: ['prescription.pdf'],
    timeline: [
      { step: 'Submitted', date: '2024-12-20', status: 'completed' },
      { step: 'Under Review', date: '2024-12-21', status: 'current' },
      { step: 'Approval', date: null, status: 'pending' },
      { step: 'Payment', date: null, status: 'pending' }
    ]
  },
  {
    id: 'CL-003',
    policyId: 'POL-003',
    policyName: 'Weather-Based Crop Insurance',
    type: 'Weather Damage',
    amount: '$160,000',
    status: 'approved',
    submittedDate: '2024-08-15',
    processedDate: '2024-08-20',
    description: 'Crop damage due to severe drought conditions',
    documents: ['weather_report.pdf', 'damage_assessment.pdf', 'satellite_images.pdf'],
    timeline: [
      { step: 'Auto-Submitted', date: '2024-08-15', status: 'completed' },
      { step: 'Oracle Verification', date: '2024-08-16', status: 'completed' },
      { step: 'Smart Contract Execution', date: '2024-08-18', status: 'completed' },
      { step: 'Payment Processed', date: '2024-08-20', status: 'completed' }
    ]
  },
  {
    id: 'CL-004',
    policyId: 'POL-002',
    policyName: 'Global Travel Protection',
    type: 'Trip Cancellation',
    amount: '$3,200',
    status: 'under-review',
    submittedDate: '2024-12-18',
    processedDate: null,
    description: 'Flight cancellation due to weather conditions',
    documents: ['flight_cancellation.pdf', 'weather_report.pdf'],
    timeline: [
      { step: 'Submitted', date: '2024-12-18', status: 'completed' },
      { step: 'Documentation Review', date: '2024-12-19', status: 'current' },
      { step: 'Approval', date: null, status: 'pending' },
      { step: 'Payment', date: null, status: 'pending' }
    ]
  },
  {
    id: 'CL-005',
    policyId: 'POL-001',
    policyName: 'Comprehensive Health Coverage',
    type: 'Dental Care',
    amount: '$1,800',
    status: 'rejected',
    submittedDate: '2024-11-25',
    processedDate: '2024-11-28',
    description: 'Dental implant procedure',
    documents: ['dental_report.pdf', 'treatment_plan.pdf'],
    timeline: [
      { step: 'Submitted', date: '2024-11-25', status: 'completed' },
      { step: 'Under Review', date: '2024-11-26', status: 'completed' },
      { step: 'Rejected', date: '2024-11-28', status: 'completed' }
    ]
  },
  {
    id: 'CL-006',
    policyId: 'POL-002',
    policyName: 'Global Travel Protection',
    type: 'Medical Emergency',
    amount: '$8,500',
    status: 'approved',
    submittedDate: '2024-11-10',
    processedDate: '2024-11-15',
    description: 'Emergency medical treatment abroad',
    documents: ['hospital_bill.pdf', 'medical_report.pdf', 'travel_docs.pdf'],
    timeline: [
      { step: 'Submitted', date: '2024-11-10', status: 'completed' },
      { step: 'Under Review', date: '2024-11-11', status: 'completed' },
      { step: 'Approved', date: '2024-11-15', status: 'completed' },
      { step: 'Payment Processed', date: '2024-11-16', status: 'completed' }
    ]
  },
  {
    id: 'CL-007',
    policyId: 'POL-001',
    policyName: 'Comprehensive Health Coverage',
    type: 'Specialist Consultation',
    amount: '$650',
    status: 'pending',
    submittedDate: '2024-12-15',
    processedDate: null,
    description: 'Cardiology specialist consultation',
    documents: ['referral.pdf', 'consultation_report.pdf'],
    timeline: [
      { step: 'Submitted', date: '2024-12-15', status: 'completed' },
      { step: 'Initial Review', date: '2024-12-16', status: 'current' },
      { step: 'Medical Review', date: null, status: 'pending' },
      { step: 'Approval', date: null, status: 'pending' }
    ]
  },
  {
    id: 'CL-008',
    policyId: 'POL-003',
    policyName: 'Weather-Based Crop Insurance',
    type: 'Hail Damage',
    amount: '$45,000',
    status: 'approved',
    submittedDate: '2024-09-22',
    processedDate: '2024-09-25',
    description: 'Hail damage to corn crops',
    documents: ['damage_photos.pdf', 'weather_data.pdf', 'adjuster_report.pdf'],
    timeline: [
      { step: 'Auto-Submitted', date: '2024-09-22', status: 'completed' },
      { step: 'Oracle Verification', date: '2024-09-23', status: 'completed' },
      { step: 'Damage Assessment', date: '2024-09-24', status: 'completed' },
      { step: 'Payment Processed', date: '2024-09-25', status: 'completed' }
    ]
  },
  {
    id: 'CL-009',
    policyId: 'POL-002',
    policyName: 'Global Travel Protection',
    type: 'Lost Luggage',
    amount: '$1,200',
    status: 'under-review',
    submittedDate: '2024-12-12',
    processedDate: null,
    description: 'Lost luggage during international flight',
    documents: ['airline_report.pdf', 'luggage_receipt.pdf'],
    timeline: [
      { step: 'Submitted', date: '2024-12-12', status: 'completed' },
      { step: 'Airline Verification', date: '2024-12-13', status: 'current' },
      { step: 'Approval', date: null, status: 'pending' },
      { step: 'Payment', date: null, status: 'pending' }
    ]
  },
  {
    id: 'CL-010',
    policyId: 'POL-001',
    policyName: 'Comprehensive Health Coverage',
    type: 'Physical Therapy',
    amount: '$2,100',
    status: 'approved',
    submittedDate: '2024-10-30',
    processedDate: '2024-11-05',
    description: 'Physical therapy sessions for back injury',
    documents: ['therapy_plan.pdf', 'progress_notes.pdf'],
    timeline: [
      { step: 'Submitted', date: '2024-10-30', status: 'completed' },
      { step: 'Under Review', date: '2024-10-31', status: 'completed' },
      { step: 'Approved', date: '2024-11-05', status: 'completed' },
      { step: 'Payment Processed', date: '2024-11-06', status: 'completed' }
    ]
  },
  {
    id: 'CL-011',
    policyId: 'POL-003',
    policyName: 'Weather-Based Crop Insurance',
    type: 'Frost Damage',
    amount: '$28,000',
    status: 'pending',
    submittedDate: '2024-12-08',
    processedDate: null,
    description: 'Unexpected frost damage to citrus crops',
    documents: ['temperature_data.pdf', 'crop_assessment.pdf'],
    timeline: [
      { step: 'Auto-Submitted', date: '2024-12-08', status: 'completed' },
      { step: 'Oracle Verification', date: '2024-12-09', status: 'current' },
      { step: 'Damage Assessment', date: null, status: 'pending' },
      { step: 'Payment', date: null, status: 'pending' }
    ]
  },
  {
    id: 'CL-012',
    policyId: 'POL-002',
    policyName: 'Global Travel Protection',
    type: 'Flight Delay',
    amount: '$800',
    status: 'approved',
    submittedDate: '2024-11-28',
    processedDate: '2024-11-30',
    description: 'Flight delay compensation for missed connection',
    documents: ['flight_delay_notice.pdf', 'additional_expenses.pdf'],
    timeline: [
      { step: 'Submitted', date: '2024-11-28', status: 'completed' },
      { step: 'Airline Verification', date: '2024-11-29', status: 'completed' },
      { step: 'Approved', date: '2024-11-30', status: 'completed' },
      { step: 'Payment Processed', date: '2024-12-01', status: 'completed' }
    ]
  },
  {
    id: 'CL-013',
    policyId: 'POL-001',
    policyName: 'Comprehensive Health Coverage',
    type: 'Surgery',
    amount: '$15,000',
    status: 'under-review',
    submittedDate: '2024-12-05',
    processedDate: null,
    description: 'Arthroscopic knee surgery',
    documents: ['surgical_report.pdf', 'pre_auth.pdf', 'hospital_bill.pdf'],
    timeline: [
      { step: 'Submitted', date: '2024-12-05', status: 'completed' },
      { step: 'Initial Review', date: '2024-12-06', status: 'completed' },
      { step: 'Medical Review', date: '2024-12-07', status: 'current' },
      { step: 'Approval', date: null, status: 'pending' }
    ]
  },
  {
    id: 'CL-014',
    policyId: 'POL-003',
    policyName: 'Weather-Based Crop Insurance',
    type: 'Drought Damage',
    amount: '$75,000',
    status: 'rejected',
    submittedDate: '2024-10-15',
    processedDate: '2024-10-20',
    description: 'Drought damage claim for wheat crops',
    documents: ['rainfall_data.pdf', 'yield_report.pdf'],
    timeline: [
      { step: 'Auto-Submitted', date: '2024-10-15', status: 'completed' },
      { step: 'Oracle Verification', date: '2024-10-16', status: 'completed' },
      { step: 'Rejected', date: '2024-10-20', status: 'completed' }
    ]
  },
  {
    id: 'CL-015',
    policyId: 'POL-002',
    policyName: 'Global Travel Protection',
    type: 'Emergency Evacuation',
    amount: '$25,000',
    status: 'approved',
    submittedDate: '2024-09-10',
    processedDate: '2024-09-12',
    description: 'Emergency medical evacuation from remote location',
    documents: ['evacuation_report.pdf', 'medical_necessity.pdf'],
    timeline: [
      { step: 'Submitted', date: '2024-09-10', status: 'completed' },
      { step: 'Emergency Review', date: '2024-09-10', status: 'completed' },
      { step: 'Approved', date: '2024-09-12', status: 'completed' },
      { step: 'Payment Processed', date: '2024-09-13', status: 'completed' }
    ]
  },
  {
    id: 'CL-016',
    policyId: 'POL-001',
    policyName: 'Comprehensive Health Coverage',
    type: 'Mental Health',
    amount: '$1,500',
    status: 'pending',
    submittedDate: '2024-12-01',
    processedDate: null,
    description: 'Mental health counseling sessions',
    documents: ['treatment_plan.pdf', 'session_notes.pdf'],
    timeline: [
      { step: 'Submitted', date: '2024-12-01', status: 'completed' },
      { step: 'Initial Review', date: '2024-12-02', status: 'completed' },
      { step: 'Mental Health Review', date: '2024-12-03', status: 'current' },
      { step: 'Approval', date: null, status: 'pending' }
    ]
  }
];
