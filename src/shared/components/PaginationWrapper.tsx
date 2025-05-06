import { ReactNode, useMemo } from 'react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

type Props = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  children: ReactNode;
};

export default function PaginationWrapper({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  children,
}: Props) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const showBottom = totalItems > itemsPerPage / 2;

  // Helper to build numbered pages with ellipsis
  const getPageNumbers = useMemo(() => {
    const range: (number | '...')[] = [];
    const siblingCount = 1;

    const start = Math.max(2, currentPage - siblingCount);
    const end = Math.min(totalPages - 1, currentPage + siblingCount);

    range.push(1);

    if (start > 2) range.push('...');
    for (let i = start; i <= end; i++) range.push(i);
    if (end < totalPages - 1) range.push('...');

    if (totalPages > 1) range.push(totalPages);
    return range;
  }, [currentPage, totalPages]);

  const renderControls = () => (
    <div className="flex items-center justify-center flex-wrap gap-2 py-4">
      <button
        className="px-2 py-1 text-sm text-gray-600 hover:text-title rounded hover:bg-gray-100 disabled:text-gray-300 cursor-pointer"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        <FiChevronsLeft />
      </button>
      <button
        className="px-2 py-1 text-sm text-gray-600 hover:text-title rounded hover:bg-gray-100 disabled:text-gray-300 cursor-pointer"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FiChevronLeft />
      </button>

      {getPageNumbers.map((p, idx) =>
        p === '...' ? (
          <span key={idx} className="px-2 text-gray-400">...</span>
        ) : (
          <button
            key={p}
            className={`px-3 py-1 text-sm cursor-pointer rounded ${
              currentPage === p
                ? 'bg-primary-2 text-title font-semibold'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        )
      )}

      <button
        className="px-2 py-1 text-sm text-gray-600 hover:text-title rounded hover:bg-gray-100 disabled:text-gray-300 cursor-pointer"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FiChevronRight />
      </button>
      <button
        className="px-2 py-1 text-sm text-gray-600 hover:text-title rounded hover:bg-gray-100 disabled:text-gray-300 cursor-pointer"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        <FiChevronsRight />
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      {renderControls()}
      {children}
      {showBottom && renderControls()}
    </div>
  );
}
