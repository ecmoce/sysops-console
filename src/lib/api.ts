import { mockHosts, mockAlerts, mockFleetOverview, generateMetrics, getInventory, hostMetricSnapshots, mockHealthChecks } from '../mocks/data';
import type { Host, AlertRow, FleetOverview, MetricRow, InventoryRow, HealthCheck } from './types';

const API_BASE = '/api/v1';

async function fetchApi<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`${res.status}`);
    const json = await res.json();
    return json.data ?? json;
  } catch {
    return fallback;
  }
}

export async function getHosts(): Promise<Host[]> {
  return fetchApi('/hosts', mockHosts);
}

export async function getHost(hostname: string): Promise<Host | undefined> {
  return fetchApi(`/hosts/${hostname}`, mockHosts.find(h => h.hostname === hostname));
}

export async function getHostMetrics(hostname: string, metrics: string = 'cpu_usage', hours: number = 1): Promise<MetricRow[]> {
  const from = new Date(Date.now() - hours * 3600_000).toISOString();
  const to = new Date().toISOString();
  return fetchApi(`/hosts/${hostname}/metrics?from=${from}&to=${to}&metrics=${metrics}`, generateMetrics(hostname, metrics, hours));
}

export async function getHostAlerts(hostname: string): Promise<AlertRow[]> {
  return fetchApi(`/hosts/${hostname}/alerts?limit=50`, mockAlerts.filter(a => a.hostname === hostname));
}

export async function getHostInventory(hostname: string): Promise<InventoryRow> {
  return fetchApi(`/hosts/${hostname}/inventory`, getInventory(hostname));
}

export async function getFleetOverview(): Promise<FleetOverview> {
  return fetchApi('/fleet/overview', mockFleetOverview);
}

export async function getAllAlerts(): Promise<AlertRow[]> {
  return fetchApi('/alerts?per_page=200', mockAlerts);
}

export function getHostMetricSnapshot(hostname: string) {
  return hostMetricSnapshots[hostname] ?? { cpu: 0, memory: 0, disk: 0 };
}

export async function acknowledgeAlert(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/alerts/${id}/ack`, { method: 'POST' });
  } catch {
    // Mock mode — silently succeed
  }
}

// ── Health Checks ──

export async function getHealthChecks(hostname?: string): Promise<HealthCheck[]> {
  const params = hostname ? `?hostname=${hostname}&limit=100` : '?limit=100';
  const fallback = hostname ? mockHealthChecks.filter(c => c.hostname === hostname) : mockHealthChecks;
  return fetchApi(`/health-checks${params}`, fallback);
}

export async function getHealthCheck(id: string): Promise<HealthCheck | null> {
  return fetchApi(`/health-checks/${id}`, mockHealthChecks.find(c => c.id === id) ?? null);
}

export async function approveHealthCheck(id: string): Promise<void> {
  await fetch(`${API_BASE}/health-checks/${id}/approve`, { method: 'POST' });
}

export async function rejectHealthCheck(id: string): Promise<void> {
  await fetch(`${API_BASE}/health-checks/${id}/reject`, { method: 'POST' });
}

export async function executeHealthCheck(id: string, actionIndex?: number): Promise<any> {
  const body = actionIndex !== undefined ? { action_index: actionIndex } : {};
  const res = await fetch(`${API_BASE}/health-checks/${id}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function getHealthCheckResult(id: string): Promise<any> {
  return fetchApi(`/health-checks/${id}/result`, null);
}
