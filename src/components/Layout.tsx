import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Server, Bell, Package, Settings, Activity } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/hosts', icon: Server, label: 'Hosts' },
  { to: '/alerts', icon: Bell, label: 'Alerts' },
  { to: '/inventory', icon: Package, label: 'Inventory' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Layout() {
  return (
    <div className="flex h-screen bg-slate-900 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
        <div className="px-6 py-5 flex items-center gap-3 border-b border-slate-800">
          <Activity className="w-7 h-7 text-blue-500" />
          <span className="text-lg font-bold tracking-tight">SysOps Console</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-slate-800 text-xs text-slate-500">
          v0.1.0 — SysOps
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
