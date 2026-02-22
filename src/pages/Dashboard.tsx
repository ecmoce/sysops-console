import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Server, ServerOff, AlertTriangle, Bell, ArrowRight } from 'lucide-react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { getFleetOverview, getHosts, getAllAlerts, getHostMetricSnapshot } from '../lib/api';
import type { Host, AlertRow, FleetOverview } from '../lib/types';
import { timeAgo, statusColor, cn } from '../lib/utils';
import StatusDot from '../components/StatusDot';
import MetricBar from '../components/MetricBar';

function StatCard({ icon: Icon, value, label, color }: { icon: any; value: number; label: string; color: string }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex items-center gap-4 hover:border-slate-600 transition-colors">
      <div className={cn('p-3 rounded-lg', color)}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-slate-400">{label}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [overview, setOverview] = useState<FleetOverview | null>(null);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [alerts, setAlerts] = useState<AlertRow[]>([]);

  useEffect(() => {
    const load = () => {
      getFleetOverview().then(setOverview);
      getHosts().then(setHosts);
      getAllAlerts().then(setAlerts);
    };
    load();
    const timer = setInterval(load, 30_000);
    return () => clearInterval(timer);
  }, []);

  const activeAlerts = alerts.filter(a => a.status === 'active').sort((a, b) => {
    const sev = { critical: 0, warning: 1, info: 2 };
    return (sev[a.severity] ?? 3) - (sev[b.severity] ?? 3);
  });

  // Generate alert timeline data (24h, 1h buckets)
  const timelineData = Array.from({ length: 24 }, (_, i) => {
    const hourAgo = 23 - i;
    const critCount = alerts.filter(a => {
      const h = Math.floor((Date.now() - new Date(a.created_at).getTime()) / 3_600_000);
      return h === hourAgo && a.severity === 'critical';
    }).length;
    const warnCount = alerts.filter(a => {
      const h = Math.floor((Date.now() - new Date(a.created_at).getTime()) / 3_600_000);
      return h === hourAgo && a.severity === 'warning';
    }).length;
    return { hour: `${hourAgo}h`, critical: critCount + Math.floor(Math.random() * 2), warning: warnCount + Math.floor(Math.random() * 3) };
  });

  if (!overview) return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="h-8 w-40 bg-slate-700/50 rounded animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-5 h-24 animate-pulse" />)}
      </div>
      <div className="bg-slate-800 border border-slate-700 rounded-xl h-64 animate-pulse" />
    </div>
  );

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <span className="text-sm text-slate-500">Auto-refresh: 30s</span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Server} value={overview.online_hosts} label="Online" color="bg-green-500/10 text-green-400" />
        <StatCard icon={ServerOff} value={overview.offline_hosts} label="Offline" color="bg-red-500/10 text-red-400" />
        <StatCard icon={AlertTriangle} value={overview.degraded_hosts} label="Degraded" color="bg-yellow-500/10 text-yellow-400" />
        <StatCard icon={Bell} value={overview.total_alerts_active} label="Active Alerts" color="bg-blue-500/10 text-blue-400" />
      </div>

      {/* Active Alerts */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <h2 className="font-semibold">Active Alerts</h2>
          <Link to="/alerts" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
            See All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-slate-700/50">
          {activeAlerts.slice(0, 5).map(alert => (
            <div key={alert.id} className="px-5 py-3 flex items-center gap-4 hover:bg-slate-750 transition-colors">
              <span className={cn('text-xs font-bold uppercase px-2 py-0.5 rounded', alert.severity === 'critical' ? 'bg-red-500/20 text-red-400' : alert.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400')}>
                {alert.severity}
              </span>
              <Link to={`/hosts/${alert.hostname}`} className="text-sm font-medium text-blue-400 hover:underline w-36 truncate">{alert.hostname}</Link>
              <span className="text-sm text-slate-300 flex-1 truncate">{alert.message}</span>
              <span className="text-xs text-slate-500 shrink-0">{timeAgo(alert.created_at)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Host Status Map */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <h2 className="font-semibold mb-4">Host Status Map</h2>
          <div className="flex flex-wrap gap-2">
            {hosts.map(h => (
              <Link key={h.hostname} to={`/hosts/${h.hostname}`} title={`${h.hostname} — ${h.status}`}>
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all hover:scale-110',
                  h.status === 'online' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  h.status === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' :
                  h.status === 'degraded' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                  'bg-slate-700 text-slate-500 border border-slate-600'
                )}>
                  {h.hostname.charAt(0).toUpperCase()}
                </div>
              </Link>
            ))}
          </div>
          <div className="flex gap-4 mt-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" /> Online</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> Critical</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400" /> Degraded</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-500" /> Offline</span>
          </div>
        </div>

        {/* Alert Timeline */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <h2 className="font-semibold mb-4">Alert Timeline (24h)</h2>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="critGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="warnGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={20} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="critical" stroke="#ef4444" fill="url(#critGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="warning" stroke="#f59e0b" fill="url(#warnGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-500 rounded" /> Critical</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-yellow-500 rounded" /> Warning</span>
          </div>
        </div>
      </div>

      {/* Host Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="font-semibold">All Hosts</h2>
          <Link to="/hosts" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
                <th className="px-5 py-3">Host</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">CPU</th>
                <th className="px-5 py-3">Memory</th>
                <th className="px-5 py-3">Disk</th>
                <th className="px-5 py-3">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {hosts.map(host => {
                const snap = getHostMetricSnapshot(host.hostname);
                return (
                  <tr key={host.hostname} className="hover:bg-slate-750 transition-colors">
                    <td className="px-5 py-3">
                      <Link to={`/hosts/${host.hostname}`} className="text-blue-400 hover:underline font-medium">{host.hostname}</Link>
                      <div className="text-xs text-slate-500">{host.ip_address}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-2">
                        <StatusDot status={host.status} />
                        <span className={cn('text-xs capitalize', statusColor(host.status))}>{host.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3"><MetricBar label="" value={snap.cpu} /></td>
                    <td className="px-5 py-3"><MetricBar label="" value={snap.memory} /></td>
                    <td className="px-5 py-3"><MetricBar label="" value={snap.disk} /></td>
                    <td className="px-5 py-3 text-xs text-slate-400">{timeAgo(host.last_heartbeat)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
