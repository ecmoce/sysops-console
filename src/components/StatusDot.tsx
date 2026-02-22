import { cn } from '../lib/utils';

interface Props {
  status: string;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export default function StatusDot({ status, size = 'sm', showLabel }: Props) {
  // Different shapes for accessibility (colorblind support)
  // Online: circle, Critical: triangle, Degraded: diamond, Offline: hollow circle
  const shapes: Record<string, string> = {
    online: '●',
    critical: '▲',
    degraded: '◆',
    offline: '○',
  };

  const colors: Record<string, string> = {
    online: 'text-green-400',
    critical: 'text-red-400',
    degraded: 'text-yellow-400',
    offline: 'text-slate-500',
  };

  return (
    <span className={cn('inline-flex items-center gap-1', colors[status] ?? 'text-slate-500')}
      role="status" aria-label={`Status: ${status}`} title={status}>
      <span className={cn(size === 'md' ? 'text-sm' : 'text-xs', 'leading-none')}>
        {shapes[status] ?? '●'}
      </span>
      {showLabel && <span className="text-xs capitalize">{status}</span>}
    </span>
  );
}
