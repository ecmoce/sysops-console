import { statusBg, cn } from '../lib/utils';

export default function StatusDot({ status, size = 'sm' }: { status: string; size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'lg' ? 'w-3 h-3' : size === 'md' ? 'w-2.5 h-2.5' : 'w-2 h-2';
  return (
    <span className="relative flex items-center justify-center">
      <span className={cn(s, 'rounded-full', statusBg(status))} />
      {(status === 'online' || status === 'critical') && (
        <span className={cn('absolute rounded-full animate-ping opacity-50', s, statusBg(status))} />
      )}
    </span>
  );
}
