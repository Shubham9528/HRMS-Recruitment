import PropTypes from 'prop-types';
import Skeleton from './Skeleton';
import EmptyState from '../shared/EmptyState';

export default function Table({ columns, data, isLoading = false, emptyMessage = 'No data available', emptyAction }) {
  // Render loading skeleton rows
  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto border border-border rounded-md bg-surface-elevated">
        {/* Desktop Skeleton */}
        <table className="hidden md:table w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-border">
              {columns.map((col, idx) => (
                <th key={idx} className="px-4 py-3 text-sm font-medium text-text-secondary">
                  <Skeleton className="h-4 w-24" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, rowIdx) => (
              <tr key={rowIdx} className="border-b border-border last:border-b-0">
                {columns.map((_, colIdx) => (
                  <td key={colIdx} className="px-4 py-3">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Skeleton */}
        <div className="md:hidden flex flex-col">
          {[...Array(5)].map((_, rowIdx) => (
            <div key={rowIdx} className="border-b border-border last:border-b-0 p-4 space-y-4">
              {columns.map((col, colIdx) => (
                <div key={colIdx} className="flex justify-between items-center gap-4">
                  {col.label && (
                    <Skeleton className="h-4 w-1/3" />
                  )}
                  <Skeleton className={`h-4 ${!col.label ? 'w-24 ml-auto' : 'w-1/2'}`} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render empty state
  if (!data || data.length === 0) {
    return <EmptyState title="No records found" description={emptyMessage} action={emptyAction} />;
  }

  // Render actual data table
  return (
    <div className="w-full overflow-x-auto border border-border rounded-md bg-surface-elevated">
      {/* Desktop View */}
      <table className="hidden md:table w-full text-left border-collapse whitespace-nowrap">
        <thead>
          <tr className="bg-gray-50 border-b border-border">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-sm font-medium text-text-secondary">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx} className="border-b border-border last:border-b-0 hover:bg-gray-50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-sm text-text-primary">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile View */}
      <div className="md:hidden flex flex-col">
        {data.map((row, rowIdx) => (
          <div key={rowIdx} className="border-b border-border last:border-b-0 p-4 space-y-3">
            {columns.map((col) => {
              const cellContent = col.render ? col.render(row[col.key], row) : row[col.key];
              
              // If it's an action column (usually has empty label), just render the content at the bottom
              if (!col.label) {
                return (
                  <div key={col.key} className="pt-2 border-t border-border/50 flex justify-end">
                    {cellContent}
                  </div>
                );
              }

              return (
                <div key={col.key} className="flex justify-between items-start gap-4">
                  <span className="text-sm font-medium text-text-secondary w-1/3 shrink-0">
                    {col.label}
                  </span>
                  <div className="text-sm text-text-primary flex-1 text-right break-words overflow-hidden">
                    {cellContent}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func, // optional custom render function for the cell
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  emptyMessage: PropTypes.string,
  emptyAction: PropTypes.node,
};
