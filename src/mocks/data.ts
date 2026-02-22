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
