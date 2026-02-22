import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import { getAllAlerts } from '../lib/api';
import type { AlertRow } from '../lib/types';
import { timeAgo, cn } from '../lib/utils';

export default function Alerts() {
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [search, setSearch] = useState('');
  const [sevFilter, setSevFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { getAllAlerts().then(setAlerts); }, []);

  const filtered = alerts.filter(a => {
    if (sevFilter !== 'all' && a.severity !== sevFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (search && !a.hostname.includes(search) && !a.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <Bell className="w-6 h-6 text-blue-400" />
        <h1 className="text-2xl font-bold">Alerts</h1>
        <span className="text-sm text-slate-500">{filtered.length} results</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search alerts..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div className="flex gap-1 bg-slate-800 border border-slate-700 rounded-lg p-1">
          {['all', 'critical', 'warning', 'info'].map(s => (
            <button key={s} onClick={() => setSevFilter(s)}
              className={cn('px-3 py-1.5 text-xs rounded-md capitalize', sevFilter === s ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-slate-200')}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-slate-800 border border-slate-700 rounded-lg p-1">
          {['all', 'active', 'resolved'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={cn('px-3 py-1.5 text-xs rounded-md capitalize', statusFilter === s ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-slate-200')}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="divide-y divide-slate-700/50">
          {filtered.map(a => (
            <div key={a.id} className="px-5 py-4 flex items-center gap-4 hover:bg-slate-750 transition-colors">
              <span className={cn('text-xs font-bold uppercase px-2 py-0.5 rounded shrink-0',
                a.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                a.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-blue-500/20 text-blue-400')}>
                {a.severity}
              </span>
              <Link to={`/hosts/${a.hostname}`} className="text-sm text-blue-400 hover:underline font-medium w-36 truncate shrink-0">
                {a.hostname}
              </Link>
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{a.message}</div>
                <div className="text-xs text-slate-500 mt-0.5">{a.metric_name}: {a.value} (threshold: {a.threshold})</div>
              </div>
              <span className={cn('text-xs px-2 py-0.5 rounded shrink-0',
                a.status === 'active' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400')}>
                {a.status}
              </span>
              <span className="text-xs text-slate-500 shrink-0 w-16 text-right">{timeAgo(a.created_at)}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-5 py-12 text-center text-slate-500">No alerts found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
