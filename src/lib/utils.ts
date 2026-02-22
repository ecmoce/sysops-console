export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export function statusColor(status: string): string {
  switch (status) {
    case 'online': return 'text-green-400';
    case 'offline': return 'text-red-400';
    case 'critical': return 'text-red-400';
    case 'degraded': return 'text-yellow-400';
    default: return 'text-slate-400';
  }
}

export function statusBg(status: string): string {
  switch (status) {
    case 'online': return 'bg-green-400';
    case 'offline': return 'bg-red-400';
    case 'critical': return 'bg-red-400';
    case 'degraded': return 'bg-yellow-400';
    default: return 'bg-slate-400';
  }
}

export function severityColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'text-red-400';
    case 'warning': return 'text-yellow-400';
    case 'info': return 'text-blue-400';
    default: return 'text-slate-400';
  }
}

export function severityBgColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'bg-red-500/10 border-red-500/20';
    case 'warning': return 'bg-yellow-500/10 border-yellow-500/20';
    case 'info': return 'bg-blue-500/10 border-blue-500/20';
    default: return 'bg-slate-500/10 border-slate-500/20';
  }
}

export function metricColor(value: number): string {
  if (value >= 90) return 'text-red-400';
  if (value >= 75) return 'text-yellow-400';
  return 'text-green-400';
}

export function metricBarColor(value: number): string {
  if (value >= 90) return 'bg-red-500';
  if (value >= 75) return 'bg-yellow-500';
  return 'bg-green-500';
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
