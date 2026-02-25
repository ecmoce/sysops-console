import { useEffect, useState } from 'react';
import { Shield, CheckCircle, XCircle, Play, Clock, ChevronDown, ChevronUp, Terminal } from 'lucide-react';
import { getHealthChecks, approveHealthCheck, rejectHealthCheck, executeHealthCheck } from '../lib/api';
import type { HealthCheck, ProposedAction, ExecutionResult } from '../lib/types';
import { timeAgo, cn } from '../lib/utils';

function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    info: 'bg-blue-500/20 text-blue-400',
  };
  return (
    <span className={cn('text-xs font-bold uppercase px-2 py-0.5 rounded', styles[severity] || 'bg-slate-500/20 text-slate-400')}>
      {severity}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    approved: 'bg-green-500/10 text-green-400 border-green-500/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
    executing: 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse',
    completed: 'bg-green-500/10 text-green-400 border-green-500/20',
    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return (
    <span className={cn('text-xs px-2 py-0.5 rounded border', styles[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20')}>
      {status}
    </span>
  );
}

function RiskBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-red-400',
  };
  return <span className={cn('text-xs font-medium', styles[level] || 'text-slate-400')}>⚠ {level} risk</span>;
}

function ActionCard({ action, index, checkId, checkStatus, onRefresh }: {
  action: ProposedAction;
  index: number;
  checkId: string;
  checkStatus: string;
  onRefresh: () => void;
}) {
  const [executing, setExecuting] = useState(false);

  const handleExecute = async () => {
    setExecuting(true);
    try {
      await executeHealthCheck(checkId, index);
      onRefresh();
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-200">{action.description}</span>
        <RiskBadge level={action.risk_level} />
      </div>
      <code className="block text-xs bg-slate-950 text-green-400 px-3 py-2 rounded font-mono overflow-x-auto">
        $ {action.command}
      </code>
      <div className="text-xs text-slate-500">{action.expected_outcome}</div>
      {checkStatus === 'approved' && (
        <button
          onClick={handleExecute}
          disabled={executing}
          className="mt-2 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors disabled:opacity-50"
        >
          {executing ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
          Execute
        </button>
      )}
    </div>
  );
}

function ResultCard({ result }: { result: ExecutionResult }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={cn('border rounded-lg p-3', result.success ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5')}>
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-2">
          {result.success ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
          <code className="text-xs text-slate-300 font-mono">{result.command}</code>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </div>
      {expanded && result.result && (
        <div className="mt-2 space-y-1">
          {result.result.stdout && (
            <pre className="text-xs bg-slate-950 text-slate-300 px-3 py-2 rounded overflow-x-auto max-h-40 overflow-y-auto">{result.result.stdout}</pre>
          )}
          {result.result.stderr && (
            <pre className="text-xs bg-slate-950 text-red-300 px-3 py-2 rounded overflow-x-auto max-h-40 overflow-y-auto">{result.result.stderr}</pre>
          )}
          <div className="text-xs text-slate-500">
            Exit code: {result.result.exit_code} · Duration: {result.result.duration_ms}ms
          </div>
        </div>
      )}
      {expanded && result.error && (
        <div className="mt-2 text-xs text-red-400">{result.error}</div>
      )}
    </div>
  );
}

function HealthCheckCard({ check, onRefresh }: { check: HealthCheck; onRefresh: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [acting, setActing] = useState(false);

  const handleApprove = async () => {
    setActing(true);
    try {
      await approveHealthCheck(check.id);
      onRefresh();
    } finally {
      setActing(false);
    }
  };

  const handleReject = async () => {
    setActing(true);
    try {
      await rejectHealthCheck(check.id);
      onRefresh();
    } finally {
      setActing(false);
    }
  };

  const handleExecuteAll = async () => {
    setActing(true);
    try {
      await executeHealthCheck(check.id);
      onRefresh();
    } finally {
      setActing(false);
    }
  };

  const actions: ProposedAction[] = Array.isArray(check.proposed_actions) ? check.proposed_actions : [];
  const results: ExecutionResult[] = Array.isArray(check.execution_results) ? check.execution_results : [];

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-slate-750 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <Shield className={cn('w-5 h-5', check.severity === 'critical' ? 'text-red-400' : check.severity === 'warning' ? 'text-yellow-400' : 'text-blue-400')} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-blue-400">{check.hostname}</span>
            <SeverityBadge severity={check.severity} />
            <StatusBadge status={check.status} />
          </div>
          <div className="text-sm text-slate-300 truncate">{check.summary}</div>
        </div>
        <span className="text-xs text-slate-500 shrink-0">{timeAgo(check.created_at)}</span>
        {expanded ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-slate-700 pt-4">
          {/* Details */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Analysis</h4>
            <div className="text-sm text-slate-300 whitespace-pre-wrap">{check.details}</div>
          </div>

          {/* Proposed Actions */}
          {actions.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Proposed Actions ({actions.length})
              </h4>
              <div className="space-y-2">
                {actions.map((action, i) => (
                  <ActionCard key={i} action={action} index={i} checkId={check.id} checkStatus={check.status} onRefresh={onRefresh} />
                ))}
              </div>
            </div>
          )}

          {/* Execution Results */}
          {results.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Execution Results</h4>
              <div className="space-y-2">
                {results.map((result, i) => <ResultCard key={i} result={result} />)}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {check.status === 'pending' && actions.length > 0 && (
            <div className="flex gap-2 pt-2 border-t border-slate-700">
              <button
                onClick={handleApprove}
                disabled={acting}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" /> Approve
              </button>
              <button
                onClick={handleReject}
                disabled={acting}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
            </div>
          )}

          {check.status === 'approved' && actions.length > 0 && (
            <div className="flex gap-2 pt-2 border-t border-slate-700">
              <button
                onClick={handleExecuteAll}
                disabled={acting}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors disabled:opacity-50"
              >
                <Play className="w-4 h-4" /> Execute All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HealthChecks() {
  const [checks, setChecks] = useState<HealthCheck[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'completed'>('all');
  const [loading, setLoading] = useState(true);

  const loadChecks = () => {
    getHealthChecks().then(data => {
      setChecks(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadChecks();
    const timer = setInterval(loadChecks, 15_000);
    return () => clearInterval(timer);
  }, []);

  const filtered = filter === 'all' ? checks : checks.filter(c => {
    if (filter === 'completed') return c.status === 'completed' || c.status === 'failed';
    return c.status === filter;
  });

  const counts = {
    all: checks.length,
    pending: checks.filter(c => c.status === 'pending').length,
    approved: checks.filter(c => c.status === 'approved' || c.status === 'executing').length,
    completed: checks.filter(c => c.status === 'completed' || c.status === 'failed').length,
  };

  if (loading) return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="h-8 w-48 bg-slate-700/50 rounded animate-pulse" />
      {[1, 2, 3].map(i => <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl h-24 animate-pulse" />)}
    </div>
  );

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-7 h-7 text-blue-500" />
          <h1 className="text-2xl font-bold">Health Checks</h1>
        </div>
        <span className="text-sm text-slate-500">Auto-refresh: 15s</span>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'pending', 'approved', 'completed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
              filter === f
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} {counts[f] > 0 && <span className="ml-1 text-xs opacity-60">({counts[f]})</span>}
          </button>
        ))}
      </div>

      {/* Health Check Cards */}
      {filtered.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
          <Shield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No health checks found</p>
          <p className="text-sm text-slate-500 mt-1">Health checks run automatically based on server configuration</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(check => (
            <HealthCheckCard key={check.id} check={check} onRefresh={loadChecks} />
          ))}
        </div>
      )}
    </div>
  );
}
