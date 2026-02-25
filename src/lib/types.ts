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

export interface HealthCheck {
  id: string;
  hostname: string;
  status: 'pending' | 'approved' | 'rejected' | 'executing' | 'completed' | 'failed';
  severity: 'critical' | 'warning' | 'info';
  summary: string;
  details: string;
  system_snapshot: any;
  llm_response: string;
  proposed_actions: ProposedAction[];
  execution_results: ExecutionResult[];
  created_at: string;
  reviewed_at: string | null;
  executed_at: string | null;
  completed_at: string | null;
}

export interface ProposedAction {
  description: string;
  command: string;
  risk_level: 'low' | 'medium' | 'high';
  expected_outcome: string;
}

export interface ExecutionResult {
  command: string;
  result?: { stdout: string; stderr: string; exit_code: number; duration_ms: number };
  error?: string;
  success: boolean;
}

export interface FleetOverview {
  total_hosts: number;
  online_hosts: number;
  offline_hosts: number;
  degraded_hosts: number;
  total_alerts_active: number;
  critical_alerts: number;
}
