import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  perPage?: number;
}

export default function Pagination({ page, totalPages, onPageChange, totalItems, perPage = 20 }: Props) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, totalItems ?? page * perPage);

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-slate-700 text-sm">
      {totalItems != null && (
        <span className="text-xs text-slate-500">
          {start}–{end} of {totalItems}
        </span>
      )}
      <div className="flex items-center gap-1 ml-auto">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={cn('p-1.5 rounded-lg transition-colors', page <= 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:bg-slate-700')}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
          let p: number;
          if (totalPages <= 7) {
            p = i + 1;
          } else if (page <= 4) {
            p = i + 1;
          } else if (page >= totalPages - 3) {
            p = totalPages - 6 + i;
          } else {
            p = page - 3 + i;
          }
          return (
            <button key={p} onClick={() => onPageChange(p)}
              className={cn('w-8 h-8 rounded-lg text-xs transition-colors',
                p === page ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:bg-slate-700')}>
              {p}
            </button>
          );
        })}
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={cn('p-1.5 rounded-lg transition-colors', page >= totalPages ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:bg-slate-700')}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
