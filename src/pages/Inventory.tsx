import { useEffect, useState } from 'react';
import { Search, Package } from 'lucide-react';
import { getHosts, getHostInventory } from '../lib/api';
import type { Host, InventoryRow } from '../lib/types';
import { timeAgo } from '../lib/utils';

export default function Inventory() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [inventories, setInventories] = useState<Record<string, InventoryRow>>({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    getHosts().then(async (hList) => {
      setHosts(hList);
      const invs: Record<string, InventoryRow> = {};
      for (const h of hList) {
        invs[h.hostname] = await getHostInventory(h.hostname);
      }
      setInventories(invs);
    });
  }, []);

  const filtered = hosts.filter(h =>
    !search || h.hostname.includes(search) || inventories[h.hostname]?.hardware?.cpu?.model?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <Package className="w-6 h-6 text-blue-400" />
        <h1 className="text-2xl font-bold">Inventory</h1>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input type="text" placeholder="Search inventory..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
              <th className="px-5 py-3">Host</th>
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
                <tr key={h.hostname} className="hover:bg-slate-750">
                  <td className="px-5 py-3 font-medium">{h.hostname}</td>
                  <td className="px-5 py-3 text-xs">{hw?.cpu?.model || 'N/A'}<br /><span className="text-slate-500">{hw?.cpu?.threads}T</span></td>
                  <td className="px-5 py-3 text-xs">{hw?.memory?.total_gb} GB<br /><span className="text-slate-500">{hw?.memory?.type}</span></td>
                  <td className="px-5 py-3 text-xs">{hw?.gpu?.length ? hw.gpu.map((g: any) => `${g.count}× ${g.model}`).join(', ') : '—'}</td>
                  <td className="px-5 py-3 text-xs">{hw?.storage?.map((s: any) => `${s.size_gb}GB ${s.type}`).join(', ') || 'N/A'}</td>
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
