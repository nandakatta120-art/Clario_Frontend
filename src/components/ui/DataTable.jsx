import React from 'react';
import clsx from 'clsx';
import { EmptyState } from './EmptyState';
import { FileQuestion } from 'lucide-react';

export function DataTable({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyTitle = 'No data found',
  emptyDescription = 'There is currently no data to display.',
  className,
}) {
  if (data.length === 0) {
    return (
      <EmptyState
        icon={FileQuestion}
        title={emptyTitle}
        description={emptyDescription}
        className={className}
      />
    );
  }

  return (
    <div className={clsx("bg-white rounded-2xl border border-[#E2E8F0] shadow-subtle overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={clsx(
                  "hover:bg-[#F8FAFC]/50 transition-colors",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-[#0F172A] whitespace-nowrap">
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
