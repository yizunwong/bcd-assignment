import { Server, Activity, Zap, Shield } from 'lucide-react';

export const networkNodes = [
  { id: 'node-001', type: 'Reinsurer', status: 'online', location: 'US-East', uptime: '99.9%', connections: 45 },
  { id: 'node-002', type: 'Oracle', status: 'online', location: 'EU-West', uptime: '99.8%', connections: 32 },
  { id: 'node-003', type: 'Insurer', status: 'warning', location: 'Asia-Pacific', uptime: '98.2%', connections: 28 },
  { id: 'node-004', type: 'Oracle', status: 'online', location: 'US-West', uptime: '99.9%', connections: 41 },
  { id: 'node-005', type: 'Reinsurer', status: 'maintenance', location: 'EU-Central', uptime: '95.1%', connections: 0 }
];

export const systemAlerts = [
  { id: 1, type: 'warning', message: 'High transaction volume detected', timestamp: '2 minutes ago', severity: 'medium' },
  { id: 2, type: 'info', message: 'Scheduled maintenance completed', timestamp: '1 hour ago', severity: 'low' },
  { id: 3, type: 'critical', message: 'Node disconnection in Asia-Pacific', timestamp: '3 hours ago', severity: 'high' }
];

export const smartContracts = [
  { name: 'HealthInsurance_v2.1', status: 'deployed', version: '2.1.0', lastUpdate: '2 days ago', transactions: 1247 },
  { name: 'TravelCoverage_v1.8', status: 'deployed', version: '1.8.2', lastUpdate: '1 week ago', transactions: 892 },
  { name: 'CropProtection_v3.0', status: 'testing', version: '3.0.0-beta', lastUpdate: '1 day ago', transactions: 156 },
  { name: 'ClaimsProcessor_v1.5', status: 'deployed', version: '1.5.1', lastUpdate: '3 days ago', transactions: 2103 }
];

export const systemMetrics = [
  { label: 'Total Nodes', value: '48', change: '+2.1%', icon: Server },
  { label: 'System Uptime', value: '99.8%', change: '+0.2%', icon: Activity },
  { label: 'Active Contracts', value: '12', change: '+3', icon: Zap },
  { label: 'Security Score', value: '98.5%', change: '+1.2%', icon: Shield }
];
