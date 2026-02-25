import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Cpu, MemoryStick, HardDrive, Network, AlertTriangle, Monitor } from 'lucide-react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { getHost, getHostMetrics, getHostAlerts, getHostInventory, getHostMetricSnapshot } from '../lib/api';
import type { Host, AlertRow, MetricRow, InventoryRow } from '../lib/types';
import { statusColor, timeAgo, cn, metricColor, metricBarColor } from '../lib/utils';
import StatusDot from '../components/StatusDot';

type Tab = 'overview' | 'cpu' | 'memory' | 'disk' | 'network' | 'alerts';

function ChartCard({ title, data, dataKey, color, gradientId, unit = '%', timeRange, setTimeRange }: {
  title: string; data: any[]; dataKey: string; color: string; gradientId: string; unit?: string;
  timeRange: string; setTimeRange: (v: string) => void;
}) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">{title}</h3>
        <div className="flex gap-1 bg-slate-900 rounded-lg p-0.5">
          {['1h', '6h', '24h', '7d'].map(r => (
            <button key={r} onClick={() => setTimeRange(r)}
              className={cn('px-2.5 py-1 text-xs rounded-md transition-colors', timeRange === r ? 'bg-slate-700 text-slate-200' : 'text-slate-500 hover:text-slate-300')}>
              {r}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            tick={{ fill: '#64748b', fontSize: 10 }}
            axisLine={false} tickLine={false}
            tickFormatter={(v: string) => {
              const d = new Date(v);
              return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
            }}
            minTickGap={40}
          />
          <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={30}
            tickFormatter={(v: number) => `${v}${unit}`} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
            labelFormatter={(v: any) => new Date(v).toLocaleTimeString()}
            formatter={(v: any) => [`${Number(v).toFixed(1)}${unit}`, dataKey]}
          />
          <Area type="monotone" dataKey="value" stroke={color} fill={`url(#${gradientId})`} strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function ProgressRing({ value, size = 80, strokeWidth = 8, color }: { value: number; size?: number; strokeWidth?: number; color: string }) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - value / 100);
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#334155" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-700" />
    </svg>
  );
}

export default function HostDetail() {
  const { hostname } = useParams<{ hostname: string }>();
  const [host, setHost] = useState<Host | null>(null);
  const [inventory, setInventory] = useState<InventoryRow | null>(null);
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [tab, setTab] = useState<Tab>('overview');
  const [cpuData, setCpuData] = useState<MetricRow[]>([]);
  const [memData, setMemData] = useState<MetricRow[]>([]);
  const [diskData, setDiskData] = useState<MetricRow[]>([]);
  const [cpuRange, setCpuRange] = useState('1h');
  const [memRange, setMemRange] = useState('1h');
  const [diskRange, setDiskRange] = useState('1h');

  const rangeHours = (r: string) => r === '1h' ? 1 : r === '6h' ? 6 : r === '24h' ? 24 : 168;

  useEffect(() => {
    if (!hostname) return;
    getHost(hostname).then(h => h && setHost(h));
    getHostInventory(hostname).then(setInventory);
    getHostAlerts(hostname).then(setAlerts);
  }, [hostname]);

  useEffect(() => {
    if (!hostname) return;
    getHostMetrics(hostname, 'cpu.usage_percent', rangeHours(cpuRange)).then(setCpuData);
  }, [hostname, cpuRange]);

  useEffect(() => {
    if (!hostname) return;
    getHostMetrics(hostname, 'mem.usage_percent', rangeHours(memRange)).then(setMemData);
  }, [hostname, memRange]);

  useEffect(() => {
    if (!hostname) return;
    getHostMetrics(hostname, 'disk.usage_percent', rangeHours(diskRange)).then(setDiskData);
  }, [hostname, diskRange]);

  if (!host || !hostname) return <div className="p-8 text-slate-400">Loading...</div>;

  const snap = getHostMetricSnapshot(hostname);
  const hw = inventory?.hardware;
  const sw = inventory?.software;
  const activeAlerts = alerts.filter(a => a.status === 'active');

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: Monitor },
    { id: 'cpu', label: 'CPU', icon: Cpu },
    { id: 'memory', label: 'Memory', icon: MemoryStick },
    { id: 'disk', label: 'Disk', icon: HardDrive },
    { id: 'network', label: 'Network', icon: Network },
    { id: 'alerts', label: `Alerts (${activeAlerts.length})`, icon: AlertTriangle },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/hosts" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{hostname}</h1>
              <span className="flex items-center gap-2">
                <StatusDot status={host.status} size="md" />
                <span className={cn('text-sm capitalize font-medium', statusColor(host.status))}>{host.status}</span>
              </span>
            </div>
            <div className="text-sm text-slate-500">{host.ip_address} • {host.os} • Agent {host.agent_version}</div>
          </div>
        </div>
        <div className="flex gap-2">
          {host.tags.map(t => (
            <span key={t} className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-400">{t}</span>
          ))}
        </div>
      </div>

      {/* System Info Card */}
      {inventory && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">System Information</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-slate-500 text-xs mb-1">OS / Kernel</div>
              <div>{sw?.os?.version || host.os}</div>
              <div className="text-xs text-slate-500">{host.kernel}</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs mb-1">CPU</div>
              <div>{hw?.cpu?.model || hw?.cpu?.arch || 'N/A'}</div>
              <div className="text-xs text-slate-500">
                {hw?.cpu?.cores ? `${hw.cpu.cores} cores` :
                  hw?.cpu?.sockets ? `${hw.cpu.sockets}S / ${(hw.cpu.cores_per_socket || 0) * (hw.cpu.sockets || 1)}C / ${hw.cpu.threads || 0}T` : ''}
              </div>
            </div>
            <div>
              <div className="text-slate-500 text-xs mb-1">Memory</div>
              <div>
                {hw?.memory?.total_gb ? `${hw.memory.total_gb} GB` :
                  hw?.memory?.total_bytes ? `${(hw.memory.total_bytes / 1073741824).toFixed(1)} GB` : 'N/A'}
                {hw?.memory?.type ? ` ${hw.memory.type}` : ''}
              </div>
              {hw?.memory?.dimm_count && <div className="text-xs text-slate-500">{hw.memory.dimm_count} DIMMs</div>}
              {hw?.memory?.swap_total_bytes > 0 && <div className="text-xs text-slate-500">Swap: {(hw.memory.swap_total_bytes / 1073741824).toFixed(1)} GB</div>}
            </div>
            <div>
              <div className="text-slate-500 text-xs mb-1">Network</div>
              {hw?.network?.filter((n: any) => n.name === 'eth0' || n.interface)?.slice(0, 4).map((n: any, i: number) => (
                <div key={i} className="text-xs">{n.interface || n.name}{n.speed ? ` (${n.speed})` : ''}{n.mac ? ` — ${n.mac}` : ''}</div>
              ))}
            </div>
            {hw?.gpu?.length > 0 && (
              <div>
                <div className="text-slate-500 text-xs mb-1">GPU</div>
                {hw.gpu.map((g: any, i: number) => (
                  <div key={i}>{g.count ? `${g.count}× ` : ''}{g.model}</div>
                ))}
              </div>
            )}
            {(hw?.storage?.length > 0 || hw?.disks?.length > 0) && (
              <div>
                <div className="text-slate-500 text-xs mb-1">Storage</div>
                {(hw.storage || hw.disks)?.filter((s: any) => (s.size_bytes || 0) > 0 || (s.size_gb || 0) > 0).slice(0, 4).map((s: any, i: number) => (
                  <div key={i} className="text-xs">
                    {s.device || s.name}{s.model ? ` ${s.model}` : ''} — {s.size_gb ? `${s.size_gb} GB` : `${((s.size_bytes || 0) / 1073741824).toFixed(1)} GB`}
                  </div>
                ))}
              </div>
            )}
            <div>
              <div className="text-slate-500 text-xs mb-1">Architecture</div>
              <div>{host.arch || hw?.cpu?.arch || 'N/A'}</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs mb-1">Last Heartbeat</div>
              <div>{timeAgo(host.last_heartbeat)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-800 border border-slate-700 rounded-xl p-1.5">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={cn('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              tab === id ? 'bg-blue-500/10 text-blue-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700')}>
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Gauges */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'CPU', value: snap.cpu, color: snap.cpu >= 90 ? '#ef4444' : snap.cpu >= 75 ? '#f59e0b' : '#22c55e' },
              { label: 'Memory', value: snap.memory, color: snap.memory >= 90 ? '#ef4444' : snap.memory >= 75 ? '#f59e0b' : '#22c55e' },
              { label: 'Disk', value: snap.disk, color: snap.disk >= 90 ? '#ef4444' : snap.disk >= 75 ? '#f59e0b' : '#22c55e' },
            ].map(g => (
              <div key={g.label} className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col items-center">
                <div className="relative">
                  <ProgressRing value={g.value} size={100} strokeWidth={10} color={g.color} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold">{g.value}%</span>
                  </div>
                </div>
                <span className="text-sm text-slate-400 mt-3">{g.label}</span>
              </div>
            ))}
          </div>

          {/* Mini charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="CPU Usage" data={cpuData} dataKey="value" color="#3b82f6" gradientId="cpuGrad" timeRange={cpuRange} setTimeRange={setCpuRange} />
            <ChartCard title="Memory Usage" data={memData} dataKey="value" color="#8b5cf6" gradientId="memGrad" timeRange={memRange} setTimeRange={setMemRange} />
          </div>
          <ChartCard title="Disk Usage" data={diskData} dataKey="value" color="#f59e0b" gradientId="diskGrad" timeRange={diskRange} setTimeRange={setDiskRange} />

          {/* Alerts on overview */}
          {activeAlerts.length > 0 && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl">
              <div className="px-5 py-4 border-b border-slate-700">
                <h3 className="font-semibold">Active Alerts ({activeAlerts.length})</h3>
              </div>
              <div className="divide-y divide-slate-700/50">
                {activeAlerts.map(a => (
                  <div key={a.id} className="px-5 py-3 flex items-center gap-4">
                    <span className={cn('text-xs font-bold uppercase px-2 py-0.5 rounded',
                      a.severity === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400')}>
                      {a.severity}
                    </span>
                    <span className="text-sm flex-1">{a.message}</span>
                    <span className="text-xs text-slate-500">{timeAgo(a.created_at)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'cpu' && (
        <div className="space-y-4">
          <ChartCard title="CPU Usage" data={cpuData} dataKey="value" color="#3b82f6" gradientId="cpuGrad2" timeRange={cpuRange} setTimeRange={setCpuRange} />
          {hw?.cpu && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <h3 className="font-semibold mb-4">CPU Details</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div><span className="text-slate-500 text-xs block">Model</span>{hw.cpu.model}</div>
                <div><span className="text-slate-500 text-xs block">Sockets</span>{hw.cpu.sockets}</div>
                <div><span className="text-slate-500 text-xs block">Total Cores</span>{hw.cpu.cores_per_socket * hw.cpu.sockets}</div>
                <div><span className="text-slate-500 text-xs block">Threads</span>{hw.cpu.threads}</div>
                <div><span className="text-slate-500 text-xs block">Frequency</span>{hw.cpu.frequency_mhz} MHz</div>
                <div><span className="text-slate-500 text-xs block">Current Usage</span><span className={metricColor(snap.cpu)}>{snap.cpu}%</span></div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'memory' && (
        <div className="space-y-4">
          <ChartCard title="Memory Usage" data={memData} dataKey="value" color="#8b5cf6" gradientId="memGrad2" timeRange={memRange} setTimeRange={setMemRange} />
          {hw?.memory && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <h3 className="font-semibold mb-4">Memory Details</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div><span className="text-slate-500 text-xs block">Total</span>{hw.memory.total_gb} GB</div>
                <div><span className="text-slate-500 text-xs block">Used</span>{Math.round(hw.memory.total_gb * snap.memory / 100)} GB</div>
                <div><span className="text-slate-500 text-xs block">Type</span>{hw.memory.type}</div>
                <div><span className="text-slate-500 text-xs block">DIMMs</span>{hw.memory.dimm_count}</div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Usage</span>
                  <span className={metricColor(snap.memory)}>{snap.memory}%</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full transition-all', metricBarColor(snap.memory))} style={{ width: `${snap.memory}%` }} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'disk' && (
        <div className="space-y-4">
          <ChartCard title="Disk Usage" data={diskData} dataKey="value" color="#f59e0b" gradientId="diskGrad2" timeRange={diskRange} setTimeRange={setDiskRange} />
          {hw?.storage && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <h3 className="font-semibold mb-4">Storage Devices</h3>
              <div className="space-y-4">
                {hw.storage.map((s: any, i: number) => (
                  <div key={i} className="flex items-center gap-4">
                    <HardDrive className="w-5 h-5 text-slate-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{s.device}</div>
                      <div className="text-xs text-slate-500">{s.model} • {s.type} • {s.size_gb} GB</div>
                    </div>
                    <div className="w-48">
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full', metricBarColor(snap.disk))} style={{ width: `${snap.disk}%` }} />
                      </div>
                    </div>
                    <span className={cn('text-sm', metricColor(snap.disk))}>{snap.disk}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'network' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <h3 className="font-semibold mb-4">Network Interfaces</h3>
          {hw?.network?.length > 0 ? (
            <div className="space-y-4">
              {hw.network.map((n: any, i: number) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-slate-900 rounded-lg">
                  <Network className="w-5 h-5 text-blue-400" />
                  <div className="flex-1">
                    <div className="font-medium">{n.interface}</div>
                    <div className="text-xs text-slate-500">MAC: {n.mac}</div>
                  </div>
                  <span className="text-sm text-slate-300">{n.speed}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-500 text-sm">No network data available.</div>
          )}
        </div>
      )}

      {tab === 'alerts' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl">
          {alerts.length > 0 ? (
            <div className="divide-y divide-slate-700/50">
              {alerts.map(a => (
                <div key={a.id} className="px-5 py-4 flex items-center gap-4">
                  <span className={cn('text-xs font-bold uppercase px-2 py-0.5 rounded',
                    a.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                    a.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400')}>
                    {a.severity}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm">{a.message}</div>
                    <div className="text-xs text-slate-500 mt-1">{a.metric_name}: {a.value} (threshold: {a.threshold})</div>
                  </div>
                  <span className={cn('text-xs px-2 py-0.5 rounded', a.status === 'active' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400')}>
                    {a.status}
                  </span>
                  <span className="text-xs text-slate-500">{timeAgo(a.created_at)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-12 text-center text-slate-500">No alerts for this host.</div>
          )}
        </div>
      )}
    </div>
  );
}
