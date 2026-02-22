import { metricBarColor, metricColor } from '../lib/utils';

export default function MetricBar({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className={metricColor(pct)}>{pct.toFixed(0)}%</span>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${metricBarColor(pct)}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
