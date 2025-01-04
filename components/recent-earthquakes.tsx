'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Earthquake } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Activity } from 'lucide-react';
import { useState } from 'react';
import { Pagination } from '@/components/ui/pagination';

interface RecentEarthquakesProps {
  earthquakes: Earthquake[];
  onEarthquakeClick?: (earthquake: Earthquake) => void;
}

const ITEMS_PER_PAGE = 5;

export function RecentEarthquakes({ earthquakes, onEarthquakeClick }: RecentEarthquakesProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(earthquakes.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentEarthquakes = earthquakes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude >= 7) return 'text-red-500 font-bold';
    if (magnitude >= 5) return 'text-orange-500 font-semibold';
    if (magnitude >= 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Magnitude</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Depth</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentEarthquakes.map((earthquake) => (
            <TableRow
              key={earthquake.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onEarthquakeClick?.(earthquake)}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <Activity className={`h-4 w-4 ${getMagnitudeColor(earthquake.magnitude)}`} />
                  <span className={getMagnitudeColor(earthquake.magnitude)}>
                    {earthquake.magnitude.toFixed(1)}
                  </span>
                </div>
              </TableCell>
              <TableCell>{earthquake.location.place}</TableCell>
              <TableCell>{earthquake.depth.toFixed(1)} km</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(earthquake.time), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        siblingCount={1}
      />
    </div>
  );
} 