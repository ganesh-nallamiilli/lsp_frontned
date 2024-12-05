import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Calculate range of pages to show
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div id="pagination-controls-container" className="flex items-center space-x-2">
      <button
        id="pagination-controls-container-previous-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg ${
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {getPageNumbers().map((pageNumber, index) => (
        <button
          id={`pagination-controls-container-page-button-${index}`}
          key={index}
          onClick={() => typeof pageNumber === 'number' && onPageChange(pageNumber)}
          className={`px-3 py-1 rounded-lg ${
            currentPage === pageNumber
              ? 'bg-indigo-600 text-white'
              : typeof pageNumber === 'number'
              ? 'text-gray-700 hover:bg-gray-100'
              : 'text-gray-400 cursor-default'
          }`}
        >
          {pageNumber}
        </button>
      ))}

      <button
        id="pagination-controls-container-next-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg ${
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default PaginationControls; 