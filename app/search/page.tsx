'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EarthquakeDetails } from '@/components/earthquake-details';
import { Download } from 'lucide-react';
import { Earthquake } from '@/lib/types';
import { searchEarthquakes } from '@/lib/api';
import { formatEarthquakeData } from '@/lib/utils/earthquake';
import { format } from 'date-fns';

const RESULTS_PER_PAGE = 10;

type SortOption = 'time-desc' | 'time-asc' | 'magnitude-desc' | 'magnitude-asc';

function getMagnitudeColor(magnitude: number): string {
  if (magnitude >= 7) return 'text-red-500 font-bold';
  if (magnitude >= 5) return 'text-orange-500 font-semibold';
  if (magnitude >= 3) return 'text-yellow-500';
  return 'text-green-500';
}

function defaultStartDate() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().slice(0, 10);
}

function defaultEndDate() {
  return new Date().toISOString().slice(0, 10);
}

function toCsv(earthquakes: Earthquake[]): string {
  const header = ['Date', 'Magnitude', 'Depth (km)', 'Latitude', 'Longitude', 'Place'];
  const rows = earthquakes.map(quake => [
    quake.time,
    quake.magnitude.toString(),
    quake.depth.toString(),
    quake.location.lat.toString(),
    quake.location.lng.toString(),
    `"${quake.location.place.replace(/"/g, '""')}"`,
  ]);
  return [header, ...rows].map(row => row.join(',')).join('\n');
}

export default function SearchPage() {
  const [startDate, setStartDate] = useState(defaultStartDate());
  const [endDate, setEndDate] = useState(defaultEndDate());
  const [minMagnitude, setMinMagnitude] = useState('2.5');
  const [maxMagnitude, setMaxMagnitude] = useState('');
  const [placeFilter, setPlaceFilter] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('time-desc');
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null);

  const runSearch = async () => {
    setLoading(true);
    setCurrentPage(1);
    try {
      const data = await searchEarthquakes({
        startTime: new Date(startDate).toISOString(),
        endTime: new Date(`${endDate}T23:59:59`).toISOString(),
        minMagnitude: minMagnitude ? parseFloat(minMagnitude) : undefined,
        maxMagnitude: maxMagnitude ? parseFloat(maxMagnitude) : undefined,
      });
      setEarthquakes(data.features.map(formatEarthquakeData));
    } catch (error) {
      console.error('Error searching earthquakes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredResults = useMemo(() => {
    const filtered = placeFilter.trim()
      ? earthquakes.filter(quake =>
          quake.location.place.toLowerCase().includes(placeFilter.trim().toLowerCase())
        )
      : earthquakes;

    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'time-asc':
          return new Date(a.time).getTime() - new Date(b.time).getTime();
        case 'magnitude-desc':
          return b.magnitude - a.magnitude;
        case 'magnitude-asc':
          return a.magnitude - b.magnitude;
        case 'time-desc':
        default:
          return new Date(b.time).getTime() - new Date(a.time).getTime();
      }
    });

    return sorted;
  }, [earthquakes, placeFilter, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / RESULTS_PER_PAGE));
  const pageResults = filteredResults.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  const handleExportCsv = () => {
    const csv = toCsv(filteredResults);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `earthquakes-${startDate}-to-${endDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Search Earthquakes</h1>
        <p className="text-muted-foreground">
          Filter historical earthquake records by date, magnitude, and location.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minMagnitude">Min Magnitude</Label>
              <Input
                id="minMagnitude"
                type="number"
                step="0.1"
                min="0"
                value={minMagnitude}
                onChange={e => setMinMagnitude(e.target.value)}
                className="w-28"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxMagnitude">Max Magnitude</Label>
              <Input
                id="maxMagnitude"
                type="number"
                step="0.1"
                min="0"
                placeholder="Any"
                value={maxMagnitude}
                onChange={e => setMaxMagnitude(e.target.value)}
                className="w-28"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="place">Place</Label>
              <Input
                id="place"
                placeholder="e.g. Awash"
                value={placeFilter}
                onChange={e => setPlaceFilter(e.target.value)}
                className="w-44"
              />
            </div>

            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select value={sortOption} onValueChange={value => setSortOption(value as SortOption)}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="time-desc">Newest First</SelectItem>
                  <SelectItem value="time-asc">Oldest First</SelectItem>
                  <SelectItem value="magnitude-desc">Highest Magnitude</SelectItem>
                  <SelectItem value="magnitude-asc">Lowest Magnitude</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={runSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>

            <Button
              variant="outline"
              onClick={handleExportCsv}
              disabled={filteredResults.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {loading ? 'Searching...' : `${filteredResults.length} Results`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Magnitude</TableHead>
                    <TableHead>Depth</TableHead>
                    <TableHead>Place</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageResults.map(quake => (
                    <TableRow
                      key={quake.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedEarthquake(quake)}
                    >
                      <TableCell>{format(new Date(quake.time), 'PP p')}</TableCell>
                      <TableCell className={getMagnitudeColor(quake.magnitude)}>
                        {quake.magnitude.toFixed(1)}
                      </TableCell>
                      <TableCell>{quake.depth.toFixed(1)} km</TableCell>
                      <TableCell>{quake.location.place}</TableCell>
                    </TableRow>
                  ))}
                  {pageResults.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No earthquakes match your filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {filteredResults.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <EarthquakeDetails
        earthquake={selectedEarthquake}
        onClose={() => setSelectedEarthquake(null)}
      />
    </div>
  );
}
