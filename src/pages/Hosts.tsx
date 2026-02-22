import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, LayoutGrid, List, ChevronRight } from 'lucide-react';
import { getHosts, getHostMetricSnapshot } from '../lib/api';
import type { Host } from '../lib/types';
import { statusColor, timeAgo, cn } from '../lib/utils';
import StatusDot from '../components/StatusDot';
import MetricBar from '../components/MetricBar';

export default function Hosts() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { getHosts().then(setHosts); }, []);

  // "/" keyboard shortcut
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

  const filtered = hosts.filter(h => {
    if (statusFilter !== 'all' && h.status !== statusFilter) return false;
    if (search && !h.hostname.toLowerCase().includes(search.toLowerCase()) && !h.ip_address.includes(search)) return false;
    return true;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">Hosts</h1>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            ref={searchRef}
            type="text"
            placeholder='Search hosts... (press "/" to focus)'
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="flex gap-1 bg-slate-800 border border-slate-700 rounded-lg p-1">
          {['all', 'online', 'critical', 'degraded', 'offline'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn('px-3 py-1.5 text-xs rounded-md transition-colors capitalize', statusFilter === s ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-slate-200')}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-slate-800 border border-slate-700 rounded-lg p-1">
          <button onClick={() => setView('grid')} className={cn('p-1.5 rounded-md', view === 'grid' ? 'bg-slate-700 text-slate-200' : 'text-slate-500')}>
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button onClick={() => setView('table')} className={cn('p-1.5 rounded-md', view === 'table' ? 'bg-slate-700 text-slate-200' : 'text-slate-500')}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(host => {
            const snap = getHostMetricSnapshot(host.hostname);
            return (
              <Link
                key={host.hostname}
                to={`/hosts/${host.hostname}`}
                className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-600 hover:bg-slate-800/80 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <StatusDot status={host.status} size="md" />
                    <div>
                      <div className="font-medium">{host.hostname}</div>
                      <div className="text-xs text-slate-500">{host.ip_address}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
                <div className="space-y-2.5">
                  <MetricBar label="CPU" value={snap.cpu} />
                  <MetricBar label="Memory" value={snap.memory} />
                  <MetricBar label="Disk" value={snap.disk} />
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700/50 text-xs text-slate-500">
                  <span>{host.os}</span>
                  <span>{timeAgo(host.last_heartbeat)}</span>
                </div>
                {host.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {host.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 bg-slate-700 text-slate-400 rounded text-xs">{t}</span>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
                <th className="px-5 py-3">Host</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">OS</th>
                <th className="px-5 py-3">CPU</th>
                <th className="px-5 py-3">Memory</th>
                <th className="px-5 py-3">Disk</th>
                <th className="px-5 py-3">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filtered.map(host => {
                const snap = getHostMetricSnapshot(host.hostname);
                return (
                  <tr key={host.hostname} className="hover:bg-slate-750">
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
                    <td className="px-5 py-3 text-xs text-slate-400">{host.os}</td>
                    <td className="px-5 py-3 w-32"><MetricBar label="" value={snap.cpu} /></td>
                    <td className="px-5 py-3 w-32"><MetricBar label="" value={snap.memory} /></td>
                    <td className="px-5 py-3 w-32"><MetricBar label="" value={snap.disk} /></td>
                    <td className="px-5 py-3 text-xs text-slate-400">{timeAgo(host.last_heartbeat)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
