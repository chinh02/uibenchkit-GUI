import { useState } from 'react';
import { LeaderboardEntry, sortLeaderboardEntries } from '@/lib/githubData';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
  loading?: boolean;
}

type SortField = keyof LeaderboardEntry;
type SortDirection = 'asc' | 'desc';

export function LeaderboardTable({ data, loading }: LeaderboardTableProps) {
  const [sortField, setSortField] = useState<SortField>('overall');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field - default to descending for numbers, ascending for text
      setSortField(field);
      setSortDirection(field === 'model' ? 'asc' : 'desc');
    }
  };

  const sortedData = sortLeaderboardEntries(data, sortField, sortDirection);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-4 h-4 text-blue-primary" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-primary" />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-500">Loading leaderboard data...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th
              className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('rank')}
            >
              <div className="flex items-center gap-2 font-semibold text-sm text-gray-700">
                Rank
                <SortIcon field="rank" />
              </div>
            </th>
            <th
              className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('model')}
            >
              <div className="flex items-center gap-2 font-semibold text-sm text-gray-700">
                Model
                <SortIcon field="model" />
              </div>
            </th>
            <th
              className="px-4 py-3 text-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('clip')}
            >
              <div className="flex items-center justify-center gap-2 font-semibold text-sm text-gray-700">
                CLIP
                <SortIcon field="clip" />
              </div>
            </th>
            <th
              className="px-4 py-3 text-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('ssim')}
            >
              <div className="flex items-center justify-center gap-2 font-semibold text-sm text-gray-700">
                SSIM
                <SortIcon field="ssim" />
              </div>
            </th>
            <th
              className="px-4 py-3 text-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('text')}
            >
              <div className="flex items-center justify-center gap-2 font-semibold text-sm text-gray-700">
                Text
                <SortIcon field="text" />
              </div>
            </th>
            <th
              className="px-4 py-3 text-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('position')}
            >
              <div className="flex items-center justify-center gap-2 font-semibold text-sm text-gray-700">
                Position
                <SortIcon field="position" />
              </div>
            </th>
            <th
              className="px-4 py-3 text-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('ir')}
            >
              <div className="flex items-center justify-center gap-2 font-semibold text-sm text-gray-700">
                IR
                <SortIcon field="ir" />
              </div>
            </th>
            <th
              className="px-4 py-3 text-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('overall')}
            >
              <div className="flex items-center justify-center gap-2 font-semibold text-sm text-gray-700">
                Overall
                <SortIcon field="overall" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((entry, index) => (
            <tr
              key={index}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3 text-center">
                <span className="font-medium text-gray-900">{entry.rank}</span>
              </td>
              <td className="px-4 py-3">
                <span className="font-mono text-sm text-gray-900">
                  {entry.model}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="text-sm text-gray-700">{entry.clip}</span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="text-sm text-gray-700">{entry.ssim}</span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="text-sm text-gray-700">{entry.text}</span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="text-sm text-gray-700">{entry.position}</span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="text-sm text-gray-700">{entry.ir}</span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="font-semibold text-blue-primary">
                  {entry.overall}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
