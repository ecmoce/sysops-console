import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Package, Download } from 'lucide-react';
import { getHosts, getHostInventory } from '../lib/api';
import type { Host, InventoryRow } from '../lib/types';
import { timeAgo, cn } from '../lib/utils';
import StatusDot from '../components/StatusDot';

export default function Inventory() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [inventories, setInventories] = useState<Record<string, InventoryRow>>({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    getHosts().then(async (hList) => {
      setHosts(hList);
      const entries = await Promise.all(
        hList.map(async (h) => [h.hostname, await getHostInventory(h.hostname)] as const)
      );
      setInventories(Object.fromEntries(entries));
    });
  }, []);

  const filtered = hosts.filter(h =>
    !search || h.hostname.toLowerCase().includes(search.toLowerCase()) ||
    h.os.toLowerCase().includes(search.toLowerCase()) ||
    inventories[h.hostname]?.hardware?.cpu?.model?.toLowerCase().includes(search.toLowerCase())
  );

  const exportCsv = () => {
    const header = 'Hostname,Status,CPU,Threads,Memory (GB),Memory Type,GPU,Storage,OS,Collected';
    const rows = filtered.map(h => {
      const inv = inventories[h.hostname];
      const hw = inv?.hardware;
      return [
        h.hostname, h.status,
        hw?.cpu?.model || '', hw?.cpu?.threads || '',
        hw?.memory?.total_gb || '', hw?.memory?.type || '',
        hw?.gpu?.length ? hw.gpu.map((g: any) => `${g.count}x ${g.model}`).join('; ') : '',
        hw?.storage?.map((s: any) => `${s.size_gb}GB ${s.type}`).join('; ') || '',
        inv?.software?.os?.version || h.os,
        inv?.collected_at || ''
      ].map(v => `"${v}"`).join(',');
    });
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `sysops-inventory-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-bold">Inventory</h1>
          <span className="text-sm text-slate-500">{filtered.length} hosts</span>
        </div>
        <button onClick={exportCsv} className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-300 transition-colors">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input type="text" placeholder="Search by hostname, OS, CPU..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
              <th className="px-5 py-3">Host</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">CPU</th>
              <th className="px-5 py-3">Memory</th>
              <th className="px-5 py-3">GPU</th>
              <th className="px-5 py-3">Storage</th>
              <th className="px-5 py-3">OS</th>
              <th className="px-5 py-3">Collected</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {filtered.map(h => {
              const inv = inventories[h.hostname];
              const hw = inv?.hardware;
              return (
                <tr key={h.hostname} className="hover:bg-slate-700/30 cursor-pointer transition-colors">
                  <td className="px-5 py-3">
                    <Link to={`/hosts/${h.hostname}`} className="text-blue-400 hover:underline font-medium">{h.hostname}</Link>
                    <div className="text-xs text-slate-500">{h.ip_address}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-2">
                      <StatusDot status={h.status} />
                      <span className={cn('text-xs capitalize',
                        h.status === 'online' ? 'text-green-400' :
                        h.status === 'critical' ? 'text-red-400' :
                        h.status === 'degraded' ? 'text-yellow-400' : 'text-slate-500'
                      )}>{h.status}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs">
                    {hw?.cpu?.model || hw?.cpu?.arch || 'N/A'}<br />
                    <span className="text-slate-500">{hw?.cpu?.threads ? `${hw.cpu.threads}T` : hw?.cpu?.cores ? `${hw.cpu.cores}C` : ''}</span>
                  </td>
                  <td className="px-5 py-3 text-xs">
                    {hw?.memory?.total_gb ? `${hw.memory.total_gb} GB` : hw?.memory?.total_bytes ? `${(hw.memory.total_bytes / 1073741824).toFixed(1)} GB` : 'N/A'}
                    <br /><span className="text-slate-500">{hw?.memory?.type || ''}</span>
                  </td>
                  <td className="px-5 py-3 text-xs">{hw?.gpu?.length ? hw.gpu.map((g: any) => `${g.count ? g.count + '× ' : ''}${g.model}`).join(', ') : '—'}</td>
                  <td className="px-5 py-3 text-xs max-w-48 truncate">
                    {(hw?.storage || hw?.disks)?.filter((s: any) => (s.size_bytes || 0) > 0 || (s.size_gb || 0) > 0).slice(0, 3)
                      .map((s: any) => s.size_gb ? `${s.size_gb}GB ${s.type || ''}` : `${((s.size_bytes || 0) / 1073741824).toFixed(0)}GB`).join(', ') || 'N/A'}
                  </td>
                  <td className="px-5 py-3 text-xs">{inv?.software?.os?.version || h.os}</td>
                  <td className="px-5 py-3 text-xs text-slate-500">{inv ? timeAgo(inv.collected_at) : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
