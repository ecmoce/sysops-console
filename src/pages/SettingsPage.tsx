import { useState } from 'react';
import { Settings, Save } from 'lucide-react';

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState('http://localhost:8080');
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('sysops-settings', JSON.stringify({ apiUrl, refreshInterval, theme }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-blue-400" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">API Endpoint</label>
          <input type="text" value={apiUrl} onChange={e => setApiUrl(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
          <p className="text-xs text-slate-500 mt-1">Base URL for the SysOps Server API</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Refresh Interval (seconds)</label>
          <input type="number" value={refreshInterval} onChange={e => setRefreshInterval(Number(e.target.value))} min={5} max={300}
            className="w-32 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Theme</label>
          <div className="flex gap-2">
            {(['dark', 'light'] as const).map(t => (
              <button key={t} onClick={() => setTheme(t)}
                className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${theme === t ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-slate-900 border border-slate-700 text-slate-400'}`}>
                {t}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-1">Light theme is not yet implemented</p>
        </div>

        <button onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors">
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
