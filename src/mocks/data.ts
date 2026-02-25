import type { Host, AlertRow, FleetOverview, InventoryRow } from '../lib/types';

const now = Date.now();
const ago = (ms: number) => new Date(now - ms).toISOString();

export const mockHosts: Host[] = [
  { id: '1', hostname: 'web-server-01', ip_address: '10.0.1.5', os: 'Ubuntu 22.04 LTS', kernel: '5.15.0-91-generic', arch: 'x86_64', agent_version: '0.1.0', status: 'online', last_heartbeat: ago(10_000), tags: ['web', 'production'], metadata: {} },
  { id: '2', hostname: 'web-server-02', ip_address: '10.0.1.6', os: 'Ubuntu 22.04 LTS', kernel: '5.15.0-91-generic', arch: 'x86_64', agent_version: '0.1.0', status: 'online', last_heartbeat: ago(8_000), tags: ['web', 'production'], metadata: {} },
  { id: '3', hostname: 'gpu-server-03', ip_address: '10.0.2.10', os: 'Ubuntu 22.04 LTS', kernel: '5.15.0-91-generic', arch: 'x86_64', agent_version: '0.1.0', status: 'critical', last_heartbeat: ago(120_000), tags: ['gpu', 'ml'], metadata: {} },
  { id: '4', hostname: 'db-server-01', ip_address: '10.0.3.1', os: 'Rocky Linux 9.3', kernel: '5.14.0-362.el9', arch: 'x86_64', agent_version: '0.1.0', status: 'online', last_heartbeat: ago(5_000), tags: ['database', 'production'], metadata: {} },
  { id: '5', hostname: 'db-server-02', ip_address: '10.0.3.2', os: 'Rocky Linux 9.3', kernel: '5.14.0-362.el9', arch: 'x86_64', agent_version: '0.1.0', status: 'online', last_heartbeat: ago(7_000), tags: ['database', 'production'], metadata: {} },
  { id: '6', hostname: 'cache-server-01', ip_address: '10.0.4.1', os: 'Debian 12', kernel: '6.1.0-17-amd64', arch: 'x86_64', agent_version: '0.1.0', status: 'online', last_heartbeat: ago(3_000), tags: ['cache', 'redis'], metadata: {} },
  { id: '7', hostname: 'monitor-01', ip_address: '10.0.5.1', os: 'Ubuntu 22.04 LTS', kernel: '5.15.0-91-generic', arch: 'x86_64', agent_version: '0.1.0', status: 'degraded', last_heartbeat: ago(45_000), tags: ['monitoring'], metadata: {} },
  { id: '8', hostname: 'worker-01', ip_address: '10.0.6.1', os: 'Ubuntu 22.04 LTS', kernel: '5.15.0-91-generic', arch: 'x86_64', agent_version: '0.1.0', status: 'online', last_heartbeat: ago(12_000), tags: ['worker', 'production'], metadata: {} },
  { id: '9', hostname: 'worker-02', ip_address: '10.0.6.2', os: 'Ubuntu 22.04 LTS', kernel: '5.15.0-91-generic', arch: 'x86_64', agent_version: '0.1.0', status: 'online', last_heartbeat: ago(15_000), tags: ['worker', 'production'], metadata: {} },
  { id: '10', hostname: 'lb-01', ip_address: '10.0.0.1', os: 'Alpine 3.19', kernel: '6.6.8-0-lts', arch: 'x86_64', agent_version: '0.1.0', status: 'online', last_heartbeat: ago(2_000), tags: ['loadbalancer', 'production'], metadata: {} },
  { id: '11', hostname: 'storage-nas-01', ip_address: '10.0.7.1', os: 'TrueNAS SCALE', kernel: '6.1.0', arch: 'x86_64', agent_version: '0.1.0', status: 'online', last_heartbeat: ago(20_000), tags: ['storage'], metadata: {} },
  { id: '12', hostname: 'edge-proxy-01', ip_address: '10.0.0.5', os: 'Ubuntu 22.04 LTS', kernel: '5.15.0-91-generic', arch: 'x86_64', agent_version: '0.1.0', status: 'offline', last_heartbeat: ago(3_600_000), tags: ['edge', 'proxy'], metadata: {} },
];

export const mockAlerts: AlertRow[] = [
  { id: 'a1', hostname: 'gpu-server-03', severity: 'critical', metric_name: 'gpu_temperature', value: 92, threshold: 85, message: 'GPU 0 Temperature exceeds threshold', labels: { gpu: '0' }, status: 'active', created_at: ago(120_000) },
  { id: 'a2', hostname: 'db-server-01', severity: 'critical', metric_name: 'disk_usage_percent', value: 95, threshold: 90, message: 'Disk usage critical on /data', labels: { mount: '/data' }, status: 'active', created_at: ago(300_000) },
  { id: 'a3', hostname: 'web-server-02', severity: 'warning', metric_name: 'memory_usage_percent', value: 87, threshold: 85, message: 'Memory usage high — possible leak', labels: { process: 'java' }, status: 'active', created_at: ago(900_000) },
  { id: 'a4', hostname: 'monitor-01', severity: 'warning', metric_name: 'cpu_usage', value: 78, threshold: 75, message: 'CPU usage elevated', labels: {}, status: 'active', created_at: ago(1_200_000) },
  { id: 'a5', hostname: 'worker-01', severity: 'warning', metric_name: 'load_avg', value: 48.2, threshold: 44.8, message: 'Load average exceeds threshold', labels: {}, status: 'active', created_at: ago(1_800_000) },
  { id: 'a6', hostname: 'gpu-server-03', severity: 'critical', metric_name: 'gpu_memory', value: 79.5, threshold: 75, message: 'GPU memory utilization critical', labels: { gpu: '1' }, status: 'active', created_at: ago(180_000) },
  { id: 'a7', hostname: 'edge-proxy-01', severity: 'critical', metric_name: 'heartbeat', value: 0, threshold: 1, message: 'Host unreachable — no heartbeat', labels: {}, status: 'active', created_at: ago(3_600_000) },
  { id: 'a8', hostname: 'cache-server-01', severity: 'info', metric_name: 'connections', value: 9500, threshold: 10000, message: 'Connection count approaching limit', labels: {}, status: 'resolved', created_at: ago(7_200_000) },
];

export const mockFleetOverview: FleetOverview = {
  total_hosts: 12,
  online_hosts: 9,
  offline_hosts: 1,
  degraded_hosts: 1,
  total_alerts_active: 7,
  critical_alerts: 3,
};

export function generateMetrics(hostname: string, metricName: string, hours: number = 1): { time: string; hostname: string; metric_name: string; value: number; labels: Record<string, string> }[] {
  const points: any[] = [];
  const intervalMs = hours <= 1 ? 15_000 : hours <= 6 ? 60_000 : hours <= 24 ? 300_000 : 1_800_000;
  const count = Math.floor((hours * 3_600_000) / intervalMs);
  const base = metricName.includes('cpu') ? 45 : metricName.includes('memory') ? 62 : metricName.includes('disk') ? 71 : 50;

  for (let i = 0; i < count; i++) {
    const t = now - (count - i) * intervalMs;
    const noise = (Math.random() - 0.5) * 20;
    const wave = Math.sin((i / count) * Math.PI * 4) * 15;
    const spike = i > count * 0.7 && i < count * 0.75 ? 25 : 0;
    points.push({
      time: new Date(t).toISOString(),
      hostname,
      metric_name: metricName,
      value: Math.max(0, Math.min(100, base + wave + noise + spike)),
      labels: {},
    });
  }
  return points;
}

export const mockInventory: Record<string, InventoryRow> = {
  'web-server-01': {
    hostname: 'web-server-01',
    collected_at: ago(60_000),
    hardware: {
      cpu: { model: 'Intel Xeon Gold 6348', sockets: 2, cores_per_socket: 28, threads: 112, frequency_mhz: 2600 },
      memory: { total_gb: 512, type: 'DDR4-3200 ECC', dimm_count: 16 },
      gpu: [{ model: 'NVIDIA A100-80GB', memory_gb: 80, count: 4 }],
      storage: [
        { device: '/dev/nvme0n1', model: 'Samsung PM9A3', size_gb: 3840, type: 'NVMe SSD' },
        { device: '/dev/nvme1n1', model: 'Samsung PM9A3', size_gb: 3840, type: 'NVMe SSD' },
      ],
      network: [
        { interface: 'eno1', speed: '25Gbps', mac: 'aa:bb:cc:dd:ee:01' },
        { interface: 'eno2', speed: '25Gbps', mac: 'aa:bb:cc:dd:ee:02' },
      ],
    },
    software: {
      os: { name: 'Ubuntu', version: '22.04 LTS', kernel: '5.15.0-91-generic' },
      packages: [
        { name: 'nginx', version: '1.24.0' },
        { name: 'docker', version: '24.0.7' },
        { name: 'node', version: '20.11.0' },
        { name: 'python3', version: '3.10.12' },
      ],
      services: ['nginx', 'docker', 'node-exporter', 'sysops-agent'],
    },
  },
};

// Generate default inventory for hosts without specific data
export function getInventory(hostname: string): InventoryRow {
  if (mockInventory[hostname]) return mockInventory[hostname];
  const host = mockHosts.find(h => h.hostname === hostname);
  return {
    hostname,
    collected_at: ago(300_000),
    hardware: {
      cpu: { model: 'Intel Xeon Silver 4314', sockets: 1, cores_per_socket: 16, threads: 32, frequency_mhz: 2400 },
      memory: { total_gb: 128, type: 'DDR4-2933 ECC', dimm_count: 8 },
      gpu: [],
      storage: [{ device: '/dev/sda', model: 'Generic SSD', size_gb: 960, type: 'SATA SSD' }],
      network: [{ interface: 'eth0', speed: '10Gbps', mac: 'aa:bb:cc:00:00:01' }],
    },
    software: {
      os: { name: host?.os?.split(' ')[0] || 'Linux', version: host?.os || 'Unknown', kernel: host?.kernel || '' },
      packages: [{ name: 'docker', version: '24.0.7' }, { name: 'sysops-agent', version: host?.agent_version || '0.1.0' }],
      services: ['sysops-agent'],
    },
  };
}

// Host metric snapshots for table display
export const hostMetricSnapshots: Record<string, { cpu: number; memory: number; disk: number }> = {
  'web-server-01': { cpu: 45, memory: 62, disk: 71 },
  'web-server-02': { cpu: 38, memory: 87, disk: 45 },
  'gpu-server-03': { cpu: 88, memory: 45, disk: 32 },
  'db-server-01': { cpu: 52, memory: 71, disk: 95 },
  'db-server-02': { cpu: 35, memory: 58, disk: 62 },
  'cache-server-01': { cpu: 22, memory: 78, disk: 15 },
  'monitor-01': { cpu: 78, memory: 65, disk: 48 },
  'worker-01': { cpu: 65, memory: 55, disk: 38 },
  'worker-02': { cpu: 58, memory: 52, disk: 35 },
  'lb-01': { cpu: 15, memory: 32, disk: 12 },
  'storage-nas-01': { cpu: 8, memory: 25, disk: 82 },
  'edge-proxy-01': { cpu: 0, memory: 0, disk: 0 },
};

// ── Mock Health Checks ──

import type { HealthCheck } from '../lib/types';

export const mockHealthChecks: HealthCheck[] = [
  {
    id: 'hc-001',
    hostname: 'db-server-01',
    status: 'pending',
    severity: 'critical',
    summary: 'Disk usage at 95% on /data — immediate action required',
    details: 'The /data partition on db-server-01 is at 95% capacity (912GB / 960GB). At the current growth rate (~2GB/day), the disk will be completely full within 2-3 days. This will cause PostgreSQL to halt write operations and potentially corrupt WAL files.\n\nTop consumers:\n- /data/pgdata/base: 680GB (PostgreSQL data)\n- /data/pgdata/pg_wal: 128GB (WAL logs)\n- /data/backups: 85GB (local backups)',
    system_snapshot: {},
    llm_response: '',
    proposed_actions: [
      { description: 'Remove old WAL files beyond retention', command: 'pg_archivecleanup /data/pgdata/pg_wal 0000000100000042000000A0', risk_level: 'medium', expected_outcome: 'Recover ~40-60GB by removing archived WAL segments' },
      { description: 'Move local backups to NAS', command: 'rsync -av --remove-source-files /data/backups/ storage-nas-01:/backup/db-server-01/', risk_level: 'low', expected_outcome: 'Free 85GB by offloading backups to NAS' },
      { description: 'Analyze and vacuum large tables', command: 'psql -c "VACUUM FULL VERBOSE ANALYZE;" production_db', risk_level: 'high', expected_outcome: 'Reclaim dead tuple space, may free 10-30GB. Requires table lock.' },
    ],
    execution_results: [],
    created_at: ago(300_000),
    reviewed_at: null,
    executed_at: null,
    completed_at: null,
  },
  {
    id: 'hc-002',
    hostname: 'gpu-server-03',
    status: 'approved',
    severity: 'critical',
    summary: 'GPU temperature 92°C exceeds safe threshold (85°C)',
    details: 'GPU 0 (NVIDIA A100-80GB) on gpu-server-03 has been running at 92°C for the past 15 minutes. The thermal throttle point is 83°C and the shutdown threshold is 95°C. Current power draw is 342W (TDP: 300W).\n\nRunning processes:\n- PID 45123: python3 train_llm.py (user: ml-team, GPU mem: 72GB)\n- Fan speed: 95% (max)\n\nPossible causes: dust accumulation, failed thermal paste, or ambient temperature.',
    system_snapshot: {},
    llm_response: '',
    proposed_actions: [
      { description: 'Set GPU power limit to 250W to reduce temperature', command: 'nvidia-smi -i 0 -pl 250', risk_level: 'low', expected_outcome: 'Reduce power draw by ~27%, temperature should drop to ~80°C within 5 minutes' },
      { description: 'Check and log detailed GPU thermal info', command: 'nvidia-smi -q -d TEMPERATURE,POWER | tee /tmp/gpu-thermal-report.txt', risk_level: 'low', expected_outcome: 'Capture detailed thermal data for analysis' },
    ],
    execution_results: [],
    created_at: ago(180_000),
    reviewed_at: ago(60_000),
    executed_at: null,
    completed_at: null,
  },
  {
    id: 'hc-003',
    hostname: 'web-server-02',
    status: 'completed',
    severity: 'warning',
    summary: 'Memory usage at 87% — potential memory leak in nginx worker',
    details: 'web-server-02 memory usage has been steadily climbing over the past 48 hours (from 62% to 87%). The primary consumer is nginx worker processes which are collectively using 98GB of the 128GB available.\n\nProcess analysis:\n- nginx workers: 98GB (76% of total)\n- node.js app: 12GB (9%)\n- system: 8GB (6%)\n\nThe nginx worker memory growth pattern suggests a memory leak, possibly in a Lua module or upstream keepalive configuration.',
    system_snapshot: {},
    llm_response: '',
    proposed_actions: [
      { description: 'Graceful reload nginx to reset worker memory', command: 'systemctl reload nginx', risk_level: 'low', expected_outcome: 'New workers will start with clean memory. Active connections will complete on old workers.' },
      { description: 'Check nginx error log for anomalies', command: 'tail -200 /var/log/nginx/error.log | grep -i "alloc\\|memory\\|leak"', risk_level: 'low', expected_outcome: 'Identify any memory-related warnings in nginx logs' },
    ],
    execution_results: [
      { command: 'systemctl reload nginx', result: { stdout: '', stderr: '', exit_code: 0, duration_ms: 1250 }, success: true },
      { command: 'tail -200 /var/log/nginx/error.log | grep -i "alloc\\|memory\\|leak"', result: { stdout: '2026/02/25 10:15:32 [warn] 45123#0: *892431 upstream buffer is too small to read response\n2026/02/25 11:02:15 [warn] 45123#0: *901234 upstream buffer is too small to read response', stderr: '', exit_code: 0, duration_ms: 85 }, success: true },
    ],
    created_at: ago(3_600_000),
    reviewed_at: ago(3_000_000),
    executed_at: ago(2_400_000),
    completed_at: ago(2_400_000),
  },
  {
    id: 'hc-004',
    hostname: 'monitor-01',
    status: 'pending',
    severity: 'warning',
    summary: 'CPU usage sustained at 78% — Prometheus scrape targets may need optimization',
    details: 'monitor-01 CPU has been averaging 78% over the last hour. This is a monitoring server running Prometheus + Grafana + Alertmanager.\n\nTop CPU consumers:\n- prometheus: 62% CPU (scraping 847 targets every 15s)\n- grafana: 8% CPU\n- alertmanager: 3% CPU\n\nWith 847 scrape targets at 15s interval, Prometheus is generating ~56 scrapes/second. Increasing the scrape interval to 30s would halve the load.',
    system_snapshot: {},
    llm_response: '',
    proposed_actions: [
      { description: 'Check Prometheus TSDB stats for compaction load', command: 'curl -s http://localhost:9090/api/v1/status/tsdb | python3 -m json.tool', risk_level: 'low', expected_outcome: 'Show TSDB health: head chunks, compaction stats, WAL size' },
      { description: 'List top scrape targets by duration', command: 'curl -s http://localhost:9090/api/v1/targets | python3 -c "import sys,json; t=json.load(sys.stdin)[\'data\'][\'activeTargets\']; [print(f\'{x[\"scrapeUrl\"]:80s} {x[\"lastScrapeDuration\"]:.3f}s\') for x in sorted(t, key=lambda x: -x[\"lastScrapeDuration\"])[:20]]"', risk_level: 'low', expected_outcome: 'Identify slowest scrape targets for optimization' },
    ],
    execution_results: [],
    created_at: ago(1_200_000),
    reviewed_at: null,
    executed_at: null,
    completed_at: null,
  },
];
