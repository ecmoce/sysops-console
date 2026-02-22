export interface Host {
  id: string;
  hostname: string;
  ip_address: string;
  os: string;
  kernel: string;
  arch: string;
  agent_version: string;
  status: 'online' | 'offline' | 'degraded' | 'critical';
  last_heartbeat: string;
  tags: string[];
  metadata: Record<string, any>;
}

export interface MetricRow {
  time: string;
  hostname: string;
  metric_name: string;
  value: number;
  labels: Record<string, string>;
}

export interface AlertRow {
  id: string;
  hostname: string;
  severity: 'critical' | 'warning' | 'info';
  metric_name: string;
  value: number;
  threshold: number;
  message: string;
  labels: Record<string, string>;
  status: 'active' | 'resolved';
  created_at: string;
}

export interface InventoryRow {
  hostname: string;
  collected_at: string;
  hardware: any;
  software: any;
}

export interface FleetOverview {
  total_hosts: number;
  online_hosts: number;
  offline_hosts: number;
  degraded_hosts: number;
  total_alerts_active: number;
  critical_alerts: number;
}
