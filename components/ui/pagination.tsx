'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  const generatePaginationRange = () => {
    const range = [];
    const showLeft = currentPage > 2;
    const showRight = currentPage < totalPages - 1;

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    range.push(1);

    // Calculate start and end of range
    let start = Math.max(2, currentPage - siblingCount);
    let end = Math.min(totalPages - 1, currentPage + siblingCount);

    // Add dots if needed
    if (start > 2) {
      range.push('...');
    }

    // Add middle range
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Add dots if needed
    if (end < totalPages - 1) {
      range.push('...');
    }

    // Always show last page
    range.push(totalPages);

    return range;
  };

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center space-x-2">
        {generatePaginationRange().map((page, index) => {
          if (page === '...') {
            return (
              <div
                key={`ellipsis-${index}`}
                className="flex items-center justify-center h-8 w-8"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            );
          }

          return (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="icon"
              onClick={() => onPageChange(page as number)}
              className={cn(
                'h-8 w-8',
                currentPage === page && 'bg-primary text-primary-foreground'
              )}
            >
              {page}
            </Button>
          );
        })}
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
