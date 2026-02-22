import { useState, useEffect } from 'react';
import { Settings, Save, RotateCcw, CheckCircle, Info } from 'lucide-react';

const DEFAULTS = { apiUrl: '/api/v1', refreshInterval: 30, theme: 'dark' as const };

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState(DEFAULTS.apiUrl);
  const [refreshInterval, setRefreshInterval] = useState(DEFAULTS.refreshInterval);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [saveState, setSaveState] = useState<'idle' | 'saved' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('sysops-settings') || '{}');
      if (stored.apiUrl) setApiUrl(stored.apiUrl);
      if (stored.refreshInterval) setRefreshInterval(stored.refreshInterval);
      if (stored.theme) setTheme(stored.theme);
    } catch { /* ignore */ }
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!apiUrl.trim()) errs.apiUrl = 'API endpoint is required';
    if (refreshInterval < 5) errs.refreshInterval = 'Minimum 5 seconds';
    if (refreshInterval > 600) errs.refreshInterval = 'Maximum 600 seconds';
    if (isNaN(refreshInterval)) errs.refreshInterval = 'Must be a number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    try {
      localStorage.setItem('sysops-settings', JSON.stringify({ apiUrl, refreshInterval, theme }));
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 3000);
    } catch {
      setSaveState('error');
      setTimeout(() => setSaveState('idle'), 3000);
    }
  };

  const handleReset = () => {
    setApiUrl(DEFAULTS.apiUrl);
    setRefreshInterval(DEFAULTS.refreshInterval);
    setTheme(DEFAULTS.theme);
    setErrors({});
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-blue-400" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Connection */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Connection</h2>

        <div>
          <label className="block text-sm font-medium mb-2">API Endpoint</label>
          <input type="text" value={apiUrl} onChange={e => { setApiUrl(e.target.value); setErrors(prev => ({ ...prev, apiUrl: '' })); }}
            className={`w-full px-4 py-2.5 bg-slate-900 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${errors.apiUrl ? 'border-red-500' : 'border-slate-700'}`} />
          {errors.apiUrl ? <p className="text-xs text-red-400 mt-1">{errors.apiUrl}</p> : <p className="text-xs text-slate-500 mt-1">Base URL for the SysOps Server API</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Refresh Interval (seconds)</label>
          <input type="number" value={refreshInterval} onChange={e => { setRefreshInterval(Number(e.target.value)); setErrors(prev => ({ ...prev, refreshInterval: '' })); }}
            min={5} max={600} step={5}
            className={`w-40 px-4 py-2.5 bg-slate-900 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${errors.refreshInterval ? 'border-red-500' : 'border-slate-700'}`} />
          {errors.refreshInterval ? <p className="text-xs text-red-400 mt-1">{errors.refreshInterval}</p> : <p className="text-xs text-slate-500 mt-1">How often to poll for new data (5–600s)</p>}
        </div>
      </div>

      {/* Display */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Display</h2>

        <div>
          <label className="block text-sm font-medium mb-2">Theme</label>
          <div className="flex gap-2">
            <button onClick={() => setTheme('dark')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${theme === 'dark' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-slate-900 border border-slate-700 text-slate-400'}`}>
              🌙 Dark
            </button>
            <button disabled
              className="px-4 py-2 rounded-lg text-sm bg-slate-900 border border-slate-700 text-slate-600 cursor-not-allowed" title="Coming soon">
              ☀️ Light
            </button>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-3">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">About</h2>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Info className="w-3.5 h-3.5" />
          <span>SysOps Console v0.1.0 — React 19 + Vite + TailwindCSS</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            saveState === 'saved' ? 'bg-green-600 hover:bg-green-500' :
            saveState === 'error' ? 'bg-red-600 hover:bg-red-500' :
            'bg-blue-600 hover:bg-blue-500'
          }`}>
          {saveState === 'saved' ? <><CheckCircle className="w-4 h-4" /> Saved!</> :
           saveState === 'error' ? <><Save className="w-4 h-4" /> Save Failed</> :
           <><Save className="w-4 h-4" /> Save Settings</>}
        </button>
        <button onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 transition-colors">
          <RotateCcw className="w-4 h-4" /> Reset Defaults
        </button>
      </div>
    </div>
  );
}
