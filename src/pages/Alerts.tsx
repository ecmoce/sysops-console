import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, CheckCircle, Layers } from 'lucide-react';
import { getAllAlerts, acknowledgeAlert } from '../lib/api';
import type { AlertRow } from '../lib/types';
import { timeAgo, cn } from '../lib/utils';
import Pagination from '../components/Pagination';

const PER_PAGE = 20;

export default function Alerts() {
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [search, setSearch] = useState('');
  const [sevFilter, setSevFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [grouped, setGrouped] = useState(false);
  const [acking, setAcking] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { getAllAlerts().then(setAlerts); }, []);

  // "/" keyboard shortcut for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const filtered = alerts.filter(a => {
    if (sevFilter !== 'all' && a.severity !== sevFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (search && !a.hostname.toLowerCase().includes(search.toLowerCase()) && !a.message.toLowerCase().includes(search.toLowerCase()) && !a.metric_name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    const sevOrder = { critical: 0, warning: 1, info: 2 };
    const sev = (sevOrder[a.severity] ?? 3) - (sevOrder[b.severity] ?? 3);
    if (sev !== 0) return sev;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [search, sevFilter, statusFilter]);

  const handleAck = useCallback(async (id: string) => {
    setAcking(id);
    await acknowledgeAlert(id);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'resolved' as const } : a));
    setAcking(null);
  }, []);

  // Group by host
  const hostGroups = grouped
    ? Object.entries(paged.reduce<Record<string, AlertRow[]>>((acc, a) => { (acc[a.hostname] ??= []).push(a); return acc; }, {}))
    : null;

  const sevCounts = {
    all: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    warning: alerts.filter(a => a.severity === 'warning').length,
    info: alerts.filter(a => a.severity === 'info').length,
  };

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
          <input ref={searchRef} type="text" placeholder='Search alerts... (press "/" to focus)' value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div className="flex gap-1 bg-slate-800 border border-slate-700 rounded-lg p-1">
          {(['all', 'critical', 'warning', 'info'] as const).map(s => (
            <button key={s} onClick={() => setSevFilter(s)}
              className={cn('px-3 py-1.5 text-xs rounded-md capitalize transition-colors', sevFilter === s ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-slate-200')}>
              {s}{sevCounts[s] > 0 ? ` (${sevCounts[s]})` : ''}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-slate-800 border border-slate-700 rounded-lg p-1">
          {['all', 'active', 'resolved'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={cn('px-3 py-1.5 text-xs rounded-md capitalize transition-colors', statusFilter === s ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-slate-200')}>
              {s}
            </button>
          ))}
        </div>
        <button onClick={() => setGrouped(!grouped)}
          className={cn('flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors',
            grouped ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200')}>
          <Layers className="w-3.5 h-3.5" />
          Group
        </button>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        {grouped && hostGroups ? (
          <div className="divide-y divide-slate-700">
            {hostGroups.map(([host, groupAlerts]) => (
              <div key={host}>
                <div className="px-5 py-2.5 bg-slate-750 flex items-center gap-2">
                  <Link to={`/hosts/${host}`} className="text-sm font-medium text-blue-400 hover:underline">{host}</Link>
                  <span className="text-xs text-slate-500">({groupAlerts.length} alerts)</span>
                </div>
                <div className="divide-y divide-slate-700/50">
                  {groupAlerts.map(a => <AlertItem key={a.id} alert={a} acking={acking} onAck={handleAck} showHost={false} />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-slate-700/50">
            {paged.map(a => <AlertItem key={a.id} alert={a} acking={acking} onAck={handleAck} showHost />)}
          </div>
        )}
        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-slate-500">No alerts found.</div>
        )}
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} perPage={PER_PAGE} />
      </div>
    </div>
  );
}

function AlertItem({ alert: a, acking, onAck, showHost }: { alert: AlertRow; acking: string | null; onAck: (id: string) => void; showHost: boolean }) {
  return (
    <div className="px-5 py-4 flex items-center gap-4 hover:bg-slate-700/30 transition-colors group">
      <span className={cn('text-xs font-bold uppercase px-2 py-0.5 rounded shrink-0 flex items-center gap-1',
        a.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
        a.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
        'bg-blue-500/20 text-blue-400')}>
        <span className={cn('w-1.5 h-1.5 rounded-full',
          a.severity === 'critical' ? 'bg-red-400' :
          a.severity === 'warning' ? 'bg-yellow-400' : 'bg-blue-400')} />
        {a.severity}
      </span>
      {showHost && (
        <Link to={`/hosts/${a.hostname}`} className="text-sm text-blue-400 hover:underline font-medium w-36 truncate shrink-0">
          {a.hostname}
        </Link>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm truncate">{a.message}</div>
        <div className="text-xs text-slate-500 mt-0.5">{a.metric_name}: {a.value} (threshold: {a.threshold})</div>
      </div>
      {a.status === 'active' ? (
        <button onClick={() => onAck(a.id)} disabled={acking === a.id}
          className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors opacity-0 group-hover:opacity-100 shrink-0 disabled:opacity-50">
          <CheckCircle className="w-3.5 h-3.5" />
          {acking === a.id ? 'Acking...' : 'Ack'}
        </button>
      ) : (
        <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-400 shrink-0">
          ✓ resolved
        </span>
      )}
      <span className="text-xs text-slate-500 shrink-0 w-16 text-right cursor-help" title={new Date(a.created_at).toLocaleString()}>
        {timeAgo(a.created_at)}
      </span>
    </div>
  );
}
