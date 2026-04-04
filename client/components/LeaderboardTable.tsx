import { useState } from 'react';
import { LeaderboardEntry, sortLeaderboardEntries } from '@/lib/githubData';
import { ArrowUpDown, ArrowUp, ArrowDown, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CompareModelsDialog } from './CompareModelsDialog';

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
  loading?: boolean;
  // Optional: customize which columns to show
  showColumns?: {
    code_similarity?: boolean;
    clip?: boolean;
    block_match?: boolean;
    text?: boolean;
    position?: boolean;
    color?: boolean;
    fg_clip?: boolean;
    method?: boolean;
  };
}

type SortField = keyof LeaderboardEntry;
type SortDirection = 'asc' | 'desc';

// Default columns configuration
const defaultColumns = {
  code_similarity: true,
  clip: true,
  block_match: true,
  text: true,
  position: true,
  color: true,
  fg_clip: true,
  method: true,
};

export function LeaderboardTable({ data, loading, showColumns = defaultColumns }: LeaderboardTableProps) {
  const [sortField, setSortField] = useState<SortField>('code_similarity');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedModels, setSelectedModels] = useState<LeaderboardEntry[]>([]);
  const [showCompareDialog, setShowCompareDialog] = useState(false);

  const cols = { ...defaultColumns, ...showColumns };

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

  const toggleModelSelection = (entry: LeaderboardEntry) => {
    setSelectedModels(prev => {
      const isSelected = prev.some(m => m.model === entry.model);
      if (isSelected) {
        return prev.filter(m => m.model !== entry.model);
      } else {
        return [...prev, entry];
      }
    });
  };

  const handleCompare = () => {
    if (selectedModels.length >= 2) {
      setShowCompareDialog(true);
    }
  };

  const handleSelectAll = () => {
    if (selectedModels.length === sortedData.length) {
      // Deselect all
      setSelectedModels([]);
    } else {
      // Select all
      setSelectedModels([...sortedData]);
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
    <>
      {/* Compare Button - Show when models are selected */}
      {selectedModels.length >= 2 && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <span className="text-sm font-medium text-blue-900">
            {selectedModels.length} models selected
          </span>
          <Button
            onClick={handleCompare}
            className="bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Compare
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-2 py-2 text-center w-10">
                <Checkbox
                  checked={
                    selectedModels.length > 0 && selectedModels.length < sortedData.length
                      ? "indeterminate"
                      : selectedModels.length === sortedData.length && sortedData.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </th>

            <th
              className="px-2 py-2 text-left cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('model')}
            >
              <div className="flex items-center gap-1 font-semibold text-xs text-gray-700 whitespace-nowrap">
                Model
                <SortIcon field="model" />
              </div>
            </th>
            {cols.method && (
              <th
                className="px-2 py-2 text-center cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('method')}
              >
                <div className="flex items-center justify-center gap-1 font-semibold text-xs text-gray-700 whitespace-nowrap">
                  Method
                  <SortIcon field="method" />
                </div>
              </th>
            )}
            {cols.clip && (
              <th
                className="px-2 py-2 text-center cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('clip')}
              >
                <div className="flex items-center justify-center gap-1 font-semibold text-xs text-gray-700 whitespace-nowrap">
                  CLIP
                  <SortIcon field="clip" />
                </div>
              </th>
            )}
            {cols.code_similarity && (
              <th
                className="px-2 py-2 text-center cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('code_similarity')}
              >
                <div className="flex items-center justify-center gap-1 font-semibold text-xs text-gray-700 whitespace-nowrap">
                  Code
                  <SortIcon field="code_similarity" />
                </div>
              </th>
            )}
            {cols.block_match && (
              <th
                className="px-2 py-2 text-center cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('block_match')}
              >
                <div className="flex items-center justify-center gap-1 font-semibold text-xs text-gray-700 whitespace-nowrap">
                  Block
                  <SortIcon field="block_match" />
                </div>
              </th>
            )}
            {cols.text && (
              <th
                className="px-2 py-2 text-center cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('text')}
              >
                <div className="flex items-center justify-center gap-1 font-semibold text-xs text-gray-700 whitespace-nowrap">
                  Text
                  <SortIcon field="text" />
                </div>
              </th>
            )}
            {cols.position && (
              <th
                className="px-2 py-2 text-center cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('position')}
              >
                <div className="flex items-center justify-center gap-1 font-semibold text-xs text-gray-700 whitespace-nowrap">
                  Pos
                  <SortIcon field="position" />
                </div>
              </th>
            )}
            {cols.color && (
              <th
                className="px-2 py-2 text-center cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('color')}
              >
                <div className="flex items-center justify-center gap-1 font-semibold text-xs text-gray-700 whitespace-nowrap">
                  Color
                  <SortIcon field="color" />
                </div>
              </th>
            )}
            {cols.fg_clip && (
              <th
                className="px-2 py-2 text-center cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('fg_clip')}
              >
                <div className="flex items-center justify-center gap-1 font-semibold text-xs text-gray-700 whitespace-nowrap">
                  FG_Clip
                  <SortIcon field="fg_clip" />
                </div>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((entry, index) => {
            const isSelected = selectedModels.some(m => m.model === entry.model);
            return (
              <tr
                key={index}
                className={`border-b border-gray-100 transition-colors ${
                  isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-2 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(e) => {
                      toggleModelSelection(entry);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>

                <td className="px-2 py-2">
                  <span className="font-mono text-xs text-gray-900 truncate block max-w-[180px]" title={entry.model}>
                    {entry.model}
                  </span>
                </td>
                {cols.method && (
                  <td className="px-2 py-2 text-center">
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                      {entry.method}
                    </span>
                  </td>
                )}
                {cols.clip && (
                  <td className="px-2 py-2 text-center">
                    <span className={`text-xs ${sortField === 'clip' ? 'font-semibold text-blue-primary' : 'text-gray-700'}`}>{entry.clip}</span>
                  </td>
                )}
                {cols.code_similarity && (
                  <td className="px-2 py-2 text-center">
                    <span className={`text-xs ${sortField === 'code_similarity' ? 'font-semibold text-blue-primary' : 'text-gray-700'}`}>{entry.code_similarity}</span>
                  </td>
                )}
                {cols.block_match && (
                  <td className="px-2 py-2 text-center">
                    <span className={`text-xs ${sortField === 'block_match' ? 'font-semibold text-blue-primary' : 'text-gray-700'}`}>{entry.block_match}</span>
                  </td>
                )}
                {cols.text && (
                  <td className="px-2 py-2 text-center">
                    <span className={`text-xs ${sortField === 'text' ? 'font-semibold text-blue-primary' : 'text-gray-700'}`}>{entry.text}</span>
                  </td>
                )}
                {cols.position && (
                  <td className="px-2 py-2 text-center">
                    <span className={`text-xs ${sortField === 'position' ? 'font-semibold text-blue-primary' : 'text-gray-700'}`}>{entry.position}</span>
                  </td>
                )}
                {cols.color && (
                  <td className="px-2 py-2 text-center">
                    <span className={`text-xs ${sortField === 'color' ? 'font-semibold text-blue-primary' : 'text-gray-700'}`}>{entry.color}</span>
                  </td>
                )}
                {cols.fg_clip && (
                  <td className="px-2 py-2 text-center">
                    <span className={`text-xs ${sortField === 'fg_clip' ? 'font-semibold text-blue-primary' : 'text-gray-700'}`}>{entry.fg_clip}</span>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    {/* Compare Dialog */}
    <CompareModelsDialog
      open={showCompareDialog}
      onOpenChange={setShowCompareDialog}
      selectedModels={selectedModels}
    />
  </>
  );
}