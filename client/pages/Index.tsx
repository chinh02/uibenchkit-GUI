import React from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CompareModelsDialog } from "@/components/CompareModelsDialog";
import { parseCSVToLeaderboard, LeaderboardEntry } from "@/lib/githubData";
import {
  Code,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  BarChart3,
} from "lucide-react";

type SortField = 'model' | 'clip_all' | 'code_similarity_all' | 'text_all' | 'position_all' | 'block_match_all' | 'color_all' | 'fg_clip_all' | 'method' | 'vision_prompt_tokens_per_instance' | 'text_prompt_tokens_per_instance' | 'response_tokens_per_instance';
type SortDirection = 'asc' | 'desc';
type BenchmarkCategory = 'dcgen' | 'design2code';

// Proxy endpoint for private repo access (now served by Express)
const PROXY_ENDPOINT = '/.netlify/functions/github-proxy';

export default function Index() {
  // Fetch leaderboard data from private GitHub repo via Express proxy
  const [leaderboardData, setLeaderboardData] = React.useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [sortField, setSortField] = React.useState<SortField>('code_similarity_all');
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc');
  const [activeCategory, setActiveCategory] = React.useState<BenchmarkCategory>('dcgen');
  const [selectedModels, setSelectedModels] = React.useState<LeaderboardEntry[]>([]);
  const [showCompareDialog, setShowCompareDialog] = React.useState(false);

  const loadCategoryData = async (category: BenchmarkCategory) => {
    setLoading(true);
    setError(null);
    setLeaderboardData([]);
    
    try {
      // Fetch from GitHub via Express proxy - try JSON first
      const jsonFilePath = `leaderboard/${category}-results.json`;
      const response = await fetch(`${PROXY_ENDPOINT}?filePath=${encodeURIComponent(jsonFilePath)}`);
      
      if (response.ok) {
        const data = await response.json();
        const entries = (data.results || []).map((entry: LeaderboardEntry, idx: number) => ({
          ...entry,
          rank: idx + 1,
          method: entry.method || '-',
        }));
        setLeaderboardData(entries);
        setError(null);
        setLoading(false);
        return;
      }

      // Fallback to CSV format
      const csvFilePath = `leaderboard/comparison_${category}.csv`;
      const csvResponse = await fetch(`${PROXY_ENDPOINT}?filePath=${encodeURIComponent(csvFilePath)}`);
      
      if (!csvResponse.ok) {
        throw new Error(`Data not available for ${category}`);
      }
      
      const csvText = await csvResponse.text();
      const entries = parseCSVToLeaderboard(csvText);
      
      // Sort by clip_all and assign ranks
      entries.sort((a, b) => {
        const valA = a.clip_all ? parseFloat(a.clip_all.replace('%', '')) : 0;
        const valB = b.clip_all ? parseFloat(b.clip_all.replace('%', '')) : 0;
        return valB - valA;
      });
      entries.forEach((entry, idx) => {
        entry.rank = idx + 1;
        entry.method = entry.method || '-';
      });
      
      setLeaderboardData(entries);
      setError(null);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadCategoryData(activeCategory);
  }, [activeCategory]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'model' ? 'asc' : 'desc');
    }
  };

  const sortData = (data: LeaderboardEntry[]) => {
    return [...data].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];
      
      // Convert percentage strings to numbers for comparison
      if (typeof aVal === 'string') {
        aVal = parseFloat(aVal.replace('%', ''));
        bVal = parseFloat(bVal?.toString().replace('%', '') || '0');
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const strA = String(aVal || '').toLowerCase();
      const strB = String(bVal || '').toLowerCase();
      
      if (sortDirection === 'asc') {
        return strA.localeCompare(strB);
      } else {
        return strB.localeCompare(strA);
      }
    });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-amber-300/60" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-amber-400" />
    ) : (
      <ArrowDown className="w-3 h-3 text-amber-400" />
    );
  };

  const sortedData = sortData(leaderboardData);

  const categories = [
    { id: 'dcgen' as BenchmarkCategory, label: 'DCGen' },
    { id: 'design2code' as BenchmarkCategory, label: 'Design2Code' },
  ];

  const handleCategoryChange = (category: BenchmarkCategory) => {
    setActiveCategory(category);
    // Reset sort to default when changing category
    setSortField('code_similarity_all');
    setSortDirection('desc');
    // Clear selected models when changing category
    setSelectedModels([]);
  };

  const toggleModelSelection = (row: LeaderboardEntry) => {
    setSelectedModels(prev => {
      const isSelected = prev.some(m => m.model === row.model);
      if (isSelected) {
        return prev.filter(m => m.model !== row.model);
      } else {
        return [...prev, row];
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

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />

      <div className="ml-64 pt-28 pb-12">
        <main className="px-8 lg:px-12">
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* Hero Section */}
            {/* <div className="flex flex-col items-center gap-4 self-stretch">
              <h1 className="text-text-primary text-center font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight lg:leading-10 tracking-[-0.9px] px-4">
                Interaction2Code
              </h1>
              <div className="px-4 sm:px-9 text-center">
                <p className="text-base sm:text-lg leading-relaxed sm:leading-[29.25px]">
                  <span className="text-text-secondary">
                    Benchmarking MLLM-based Interactive Webpage Code Generation
                    from Interactive Prototyping. Interaction2Code is a
                    collection of webpage datasets for interactive webpage
                    generation.
                  </span>{" "}
                  <a
                    href="#paper"
                    className="text-amber-600 underline hover:no-underline"
                  >
                    Paper
                  </a>
                </p>
              </div>
            </div> */}

           
            

            {/* Official Leaderboard */}
            <div
              className="flex flex-col rounded-2xl border border-amber-200/50 bg-card shadow-sm"
              id="leaderboard"
            >
              <div className="flex flex-col gap-2 p-4 sm:p-6 border-b border-amber-200/50 bg-gradient-to-r from-amber-100/50 to-amber-50/50">
                <div className="flex items-center gap-3">
                  <Code
                    className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600"
                    strokeWidth={2.33}
                  />
                  <h2 className="text-amber-700 font-bold text-xl sm:text-2xl leading-8">
                    Official Leaderboard
                  </h2>
                </div>
                <p className="text-text-muted text-xs sm:text-sm leading-5">
                  Here's exactly the Leaderboard
                </p>

                <div className="flex items-center gap-3 mt-4 flex-wrap">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`px-3 sm:px-4 py-2 rounded-xl border font-semibold text-xs sm:text-sm whitespace-nowrap transition-colors ${
                        activeCategory === category.id
                          ? 'border-amber-400 bg-amber-500 text-dark-bg'
                          : 'border-amber-200 bg-white text-text-primary hover:border-amber-400'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>

                {/* Compare Button */}
                {selectedModels.length >= 2 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900">
                      {selectedModels.length} models selected
                    </span>
                    <Button
                      onClick={handleCompare}
                      className="bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Compare Results
                    </Button>
                  </div>
                )}
              </div>

              {/* Leaderboard Table - Scrollable on mobile */}
              <div className="p-2 sm:p-4 overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center p-12">
                    <div className="text-text-muted">Loading leaderboard data...</div>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center p-12 gap-3">
                    <div className="text-amber-600 font-semibold text-lg">Data Unavailable</div>
                    <div className="text-text-muted text-sm text-center max-w-md">
                      The leaderboard data for <span className="font-medium">{activeCategory}</span> is not yet available.
                      <br />Please check back later or select a different benchmark.
                    </div>
                  </div>
                ) : sortedData.length === 0 ? (
                  <div className="flex items-center justify-center p-12">
                    <div className="text-text-muted">No data available</div>
                  </div>
                ) : (
                  <div className="rounded-lg bg-white overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-dark-bg text-amber-100">
                          <th className="px-2 py-2 text-center w-10">
                            <Checkbox
                              checked={
                                selectedModels.length === sortedData.length && sortedData.length > 0
                                  ? true
                                  : selectedModels.length > 0
                                  ? "indeterminate"
                                  : false
                              }
                              onCheckedChange={() => handleSelectAll()}
                            />
                          </th>

                          <th 
                            className="px-2 py-2 text-left cursor-pointer hover:bg-dark-surface transition-colors"
                            onClick={() => handleSort('model')}
                          >
                            <div className="flex items-center gap-1">
                              Model <SortIcon field="model" />
                            </div>
                          </th>
                          <th 
                            className="px-2 py-2 text-center cursor-pointer hover:bg-dark-surface transition-colors"
                            onClick={() => handleSort('clip_all')}
                          >
                            <div className="flex items-center justify-center gap-1">
                              CLIP <SortIcon field="clip_all" />
                            </div>
                          </th>
                          <th 
                            className="px-2 py-2 text-center cursor-pointer hover:bg-dark-surface transition-colors"
                            onClick={() => handleSort('code_similarity_all')}
                          >
                            <div className="flex items-center justify-center gap-1">
                              Code <SortIcon field="code_similarity_all" />
                            </div>
                          </th>
                          <th 
                            className="px-2 py-2 text-center cursor-pointer hover:bg-dark-surface transition-colors"
                            onClick={() => handleSort('block_match_all')}
                          >
                            <div className="flex items-center justify-center gap-1">
                              Block <SortIcon field="block_match_all" />
                            </div>
                          </th>
                          <th 
                            className="px-2 py-2 text-center cursor-pointer hover:bg-dark-surface transition-colors"
                            onClick={() => handleSort('text_all')}
                          >
                            <div className="flex items-center justify-center gap-1">
                              Text <SortIcon field="text_all" />
                            </div>
                          </th>
                          <th 
                            className="px-2 py-2 text-center cursor-pointer hover:bg-dark-surface transition-colors"
                            onClick={() => handleSort('position_all')}
                          >
                            <div className="flex items-center justify-center gap-1">
                              Pos <SortIcon field="position_all" />
                            </div>
                          </th>
                          <th 
                            className="px-2 py-2 text-center cursor-pointer hover:bg-dark-surface transition-colors"
                            onClick={() => handleSort('color_all')}
                          >
                            <div className="flex items-center justify-center gap-1">
                              Color <SortIcon field="color_all" />
                            </div>
                          </th>
                          <th 
                            className="px-2 py-2 text-center cursor-pointer hover:bg-dark-surface transition-colors"
                            onClick={() => handleSort('fg_clip_all')}
                          >
                            <div className="flex items-center justify-center gap-1">
                              FG-Clip <SortIcon field="fg_clip_all" />
                            </div>
                          </th>
                          <th 
                            className="px-2 py-2 text-center cursor-pointer hover:bg-dark-surface transition-colors"
                            onClick={() => handleSort('vision_prompt_tokens_per_instance')}
                          >
                            <div className="flex items-center justify-center gap-1">
                              <span>Vision Tokens <br/> Per Instances </span> <SortIcon field="vision_prompt_tokens_per_instance" />
                            </div>
                          </th>
                          <th 
                            className="px-2 py-2 text-center cursor-pointer hover:bg-dark-surface transition-colors"
                            onClick={() => handleSort('text_prompt_tokens_per_instance')}
                          >
                            <div className="flex items-center justify-center gap-1">
                              <span>Text Tokens <br/> Per Instances </span> <SortIcon field="text_prompt_tokens_per_instance" />
                            </div>
                          </th>
                          <th 
                            className="px-2 py-2 text-center cursor-pointer hover:bg-dark-surface transition-colors"
                            onClick={() => handleSort('response_tokens_per_instance')}
                          >
                            {/* <div className="flex items-center justify-center gap-1">
                              Rsp Tok <SortIcon field="response_tokens_per_instance" />
                            </div> */}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedData.map((row, index) => {
                          const isSelected = selectedModels.some(m => m.model === row.model);
                          return (
                            <tr 
                              key={index}
                              className={`border-b border-amber-100 transition-colors ${
                                isSelected ? "bg-blue-50" : index % 2 === 0 ? "bg-amber-50/30" : ""
                              }`}
                            >
                              <td className="px-2 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => toggleModelSelection(row)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </td>

                              <td className="px-2 py-2 text-left font-medium text-gray-900 max-w-[220px] truncate" title={row.method && row.method.toLowerCase() !== 'direct' ? `${row.method}-${row.model}` : row.model}>
                                {row.method && row.method.toLowerCase() !== 'direct' ? (
                                  <><span className="text-purple-600 capitalize">{row.method}</span>-{row.model}</>
                                ) : row.model}
                              </td>
                              <td className={`px-2 py-2 text-center ${sortField === 'clip_all' ? 'font-semibold text-blue-600' : 'text-gray-700'}`}>
                                {row.clip_all || row.clip}
                              </td>
                              <td className={`px-2 py-2 text-center ${sortField === 'code_similarity_all' ? 'font-semibold text-blue-600' : 'text-gray-700'}`}>
                                {row.code_similarity_all || row.code_similarity}
                              </td>
                              <td className={`px-2 py-2 text-center ${sortField === 'block_match_all' ? 'font-semibold text-blue-600' : 'text-gray-700'}`}>
                                {row.block_match_all || row.block_match}
                              </td>
                              <td className={`px-2 py-2 text-center ${sortField === 'text_all' ? 'font-semibold text-blue-600' : 'text-gray-700'}`}>
                                {row.text_all || row.text}
                              </td>
                              <td className={`px-2 py-2 text-center ${sortField === 'position_all' ? 'font-semibold text-blue-600' : 'text-gray-700'}`}>
                                {row.position_all || row.position}
                              </td>
                              <td className={`px-2 py-2 text-center ${sortField === 'color_all' ? 'font-semibold text-blue-600' : 'text-gray-700'}`}>
                                {row.color_all || row.color}
                              </td>
                              <td className={`px-2 py-2 text-center ${sortField === 'fg_clip_all' ? 'font-semibold text-blue-600' : 'text-gray-700'}`}>
                                {row.fg_clip_all || row.fg_clip}
                              </td>
                              <td className={`px-2 py-2 text-center ${sortField === 'vision_prompt_tokens_per_instance' ? 'font-semibold text-blue-600' : 'text-gray-700'}`}>
                                {row.vision_prompt_tokens_per_instance ? Number(row.vision_prompt_tokens_per_instance).toFixed(0) : '-'}
                              </td>
                              <td className={`px-2 py-2 text-center ${sortField === 'text_prompt_tokens_per_instance' ? 'font-semibold text-blue-600' : 'text-gray-700'}`}>
                                {row.text_prompt_tokens_per_instance ? Number(row.text_prompt_tokens_per_instance).toFixed(0) : '-'}
                              </td>
                              {/* <td className={`px-2 py-2 text-center ${sortField === 'response_tokens_per_instance' ? 'font-semibold text-blue-600' : 'text-gray-700'}`}>
                                {row.response_tokens_per_instance ? Number(row.response_tokens_per_instance).toFixed(0) : '-'}
                              </td> */}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Compare Models Dialog */}
            <CompareModelsDialog
              open={showCompareDialog}
              onOpenChange={setShowCompareDialog}
              selectedModels={selectedModels}
            />

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
