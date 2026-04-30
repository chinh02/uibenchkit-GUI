import React from "react";
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
  ExternalLink,
} from "lucide-react";

type SortField =
  | "model"
  | "model_date"
  | "clip_all"
  | "code_similarity_all"
  | "text_all"
  | "position_all"
  | "block_match_all"
  | "color_all"
  | "fg_clip_all"
  | "method"
  | "vision_prompt_tokens_per_instance"
  | "text_prompt_tokens_per_instance"
  | "response_tokens_per_instance";
type SortDirection = "asc" | "desc";
export type BenchmarkCategory = "dcgen" | "design2code";

interface TrajectoryRun {
  tree_url: string;
  resolve_base: string;
}

interface TrajectoryLinks {
  runs: Record<string, TrajectoryRun>;
}

const PROXY_ENDPOINT = "/.netlify/functions/github-proxy";

interface LeaderboardSectionProps {
  /** Datasets to show. If multiple → renders a switcher. If one → hides the switcher. */
  categories: BenchmarkCategory[];
  /** Initial active category (defaults to first in list) */
  defaultCategory?: BenchmarkCategory;
  /** Title override for the section header (defaults to "Official Leaderboard") */
  title?: string;
}

const CATEGORY_LABELS: Record<BenchmarkCategory, string> = {
  dcgen: "DCGen",
  design2code: "Design2Code",
};

export function LeaderboardSection({
  categories,
  defaultCategory,
  title = "Official Leaderboard",
}: LeaderboardSectionProps) {
  const [leaderboardData, setLeaderboardData] = React.useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [sortField, setSortField] = React.useState<SortField>("code_similarity_all");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("desc");
  const [activeCategory, setActiveCategory] = React.useState<BenchmarkCategory>(
    defaultCategory || categories[0],
  );
  const [selectedModels, setSelectedModels] = React.useState<LeaderboardEntry[]>([]);
  const [showCompareDialog, setShowCompareDialog] = React.useState(false);
  const [trajectoryLinks, setTrajectoryLinks] = React.useState<
    Record<string, TrajectoryRun>
  >({});

  // Fetch trajectory links once on mount
  React.useEffect(() => {
    const loadTrajectoryLinks = async () => {
      try {
        const resp = await fetch(
          `${PROXY_ENDPOINT}?filePath=${encodeURIComponent("leaderboard/trajectory_links.json")}`,
        );
        if (resp.ok) {
          const data: TrajectoryLinks = await resp.json();
          setTrajectoryLinks(data.runs || {});
        }
      } catch {
        // Silently fail — trajectory links are optional
      }
    };
    loadTrajectoryLinks();
  }, []);

  const loadCategoryData = async (category: BenchmarkCategory) => {
    setLoading(true);
    setError(null);
    setLeaderboardData([]);

    try {
      const jsonFilePath = `leaderboard/${category}-results.json`;
      const response = await fetch(
        `${PROXY_ENDPOINT}?filePath=${encodeURIComponent(jsonFilePath)}`,
      );

      if (response.ok) {
        const data = await response.json();
        const entries = (data.results || []).map(
          (entry: LeaderboardEntry, idx: number) => ({
            ...entry,
            rank: idx + 1,
            method: entry.method || "-",
          }),
        );
        setLeaderboardData(entries);
        setError(null);
        setLoading(false);
        return;
      }

      // Fallback to CSV format
      const csvFilePath = `leaderboard/comparison_${category}.csv`;
      const csvResponse = await fetch(
        `${PROXY_ENDPOINT}?filePath=${encodeURIComponent(csvFilePath)}`,
      );

      if (!csvResponse.ok) {
        throw new Error(`Data not available for ${category}`);
      }

      const csvText = await csvResponse.text();
      const entries = parseCSVToLeaderboard(csvText);
      entries.sort((a, b) => {
        const valA = a.clip_all ? parseFloat(a.clip_all.replace("%", "")) : 0;
        const valB = b.clip_all ? parseFloat(b.clip_all.replace("%", "")) : 0;
        return valB - valA;
      });
      entries.forEach((entry, idx) => {
        entry.rank = idx + 1;
        entry.method = entry.method || "-";
      });

      setLeaderboardData(entries);
      setError(null);
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
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
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection(field === "model" ? "asc" : "desc");
    }
  };

  const sortData = (data: LeaderboardEntry[]) => {
    return [...data].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (typeof aVal === "string") {
        aVal = parseFloat(aVal.replace("%", ""));
        bVal = parseFloat(bVal?.toString().replace("%", "") || "0");
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      const strA = String(aVal || "").toLowerCase();
      const strB = String(bVal || "").toLowerCase();
      return sortDirection === "asc"
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-amber-300/60" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 text-amber-400" />
    ) : (
      <ArrowDown className="w-3 h-3 text-amber-400" />
    );
  };

  const sortedData = sortData(leaderboardData);
  const showSwitcher = categories.length > 1;

  const handleCategoryChange = (category: BenchmarkCategory) => {
    setActiveCategory(category);
    setSortField("code_similarity_all");
    setSortDirection("desc");
    setSelectedModels([]);
  };

  const rowKey = (row: LeaderboardEntry) =>
    row.run_id || `${row.method}__${row.model}`;

  const toggleModelSelection = (row: LeaderboardEntry) => {
    const key = rowKey(row);
    setSelectedModels((prev) => {
      const isSelected = prev.some((m) => rowKey(m) === key);
      if (isSelected) return prev.filter((m) => rowKey(m) !== key);
      return [...prev, row];
    });
  };

  const handleCompare = () => {
    if (selectedModels.length >= 2) setShowCompareDialog(true);
  };

  const handleSelectAll = () => {
    if (selectedModels.length === sortedData.length) {
      setSelectedModels([]);
    } else {
      setSelectedModels([...sortedData]);
    }
  };

  return (
    <>
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
              {title}
            </h2>
          </div>

          {showSwitcher && (
            <div className="flex items-center justify-center gap-4 mt-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-8 py-3 rounded-xl border-2 font-bold text-base whitespace-nowrap transition-all ${
                    activeCategory === category
                      ? "border-amber-400 bg-amber-500 text-dark-bg shadow-md"
                      : "border-amber-200 bg-white text-text-primary hover:border-amber-400 hover:bg-amber-50"
                  }`}
                >
                  {CATEGORY_LABELS[category]}
                </button>
              ))}
            </div>
          )}

          {/* Comparison feature description */}
          <div className="mt-4 p-4 bg-blue-50/60 border border-blue-200/60 rounded-lg min-w-0">
            <div className="flex items-start gap-3 min-w-0">
              <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-blue-900">
                  Model Comparison
                </p>
                <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                  Select two or more models using the checkboxes to compare their
                  performance side-by-side with bar charts and radar
                  visualizations across all evaluation metrics.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200/60 flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium text-blue-900 min-w-0">
                {selectedModels.length === 0
                  ? "No models selected"
                  : selectedModels.length === 1
                    ? "1 model selected — select at least 2"
                    : `${selectedModels.length} models selected`}
              </span>
              <Button
                onClick={handleCompare}
                disabled={selectedModels.length < 2}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shrink-0"
                size="sm"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Compare Results
              </Button>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="p-2 sm:p-4 overflow-x-auto min-w-0">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-text-muted">Loading leaderboard data...</div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-12 gap-3">
              <div className="text-amber-600 font-semibold text-lg">
                Data Unavailable
              </div>
              <div className="text-text-muted text-sm text-center max-w-md">
                The leaderboard data for{" "}
                <span className="font-medium">{activeCategory}</span> is not yet
                available.
                <br />
                Please check back later.
              </div>
            </div>
          ) : sortedData.length === 0 ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-text-muted">No data available</div>
            </div>
          ) : (
            <div className="rounded-lg bg-white">
              <table className="w-full min-w-[900px] text-xs">
                <thead>
                  <tr className="bg-dark-surface text-amber-200/80 text-[10px] uppercase tracking-wider">
                    <th className="px-2 py-1" />
                    <th className="px-2 py-1 text-left" colSpan={2}>
                      Info
                    </th>
                    <th
                      className="px-2 py-1 text-center border-l border-amber-700/30"
                      colSpan={2}
                    >
                      Overall Similarity
                    </th>
                    <th
                      className="px-2 py-1 text-center border-l border-amber-700/30"
                      colSpan={5}
                    >
                      Fine-Grained Metrics
                    </th>
                    <th
                      className="px-2 py-1 text-center border-l border-amber-700/30"
                      colSpan={2}
                    >
                      Token Usage
                    </th>
                  </tr>
                  <tr className="bg-dark-bg text-amber-100">
                    <th className="px-2 py-2 text-center w-10">
                      <Checkbox
                        checked={
                          selectedModels.length === sortedData.length &&
                          sortedData.length > 0
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
                      onClick={() => handleSort("model")}
                    >
                      <div className="flex items-center gap-1">
                        Model <SortIcon field="model" />
                      </div>
                    </th>
                    <th
                      className="px-2 py-2 text-center cursor-pointer hover:bg-dark-surface transition-colors"
                      onClick={() => handleSort("model_date")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Date <SortIcon field="model_date" />
                      </div>
                    </th>
                    <th
                      className="px-2 py-2 text-center cursor-pointer hover:bg-dark-surface transition-colors border-l border-amber-700/30"
                      onClick={() => handleSort("clip_all")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        CLIP <SortIcon field="clip_all" />
                      </div>
                    </th>
                    <th
                      className="px-2 py-2 text-center cursor-pointer hover:bg-dark-surface transition-colors"
                      onClick={() => handleSort("code_similarity_all")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Code <SortIcon field="code_similarity_all" />
                      </div>
                    </th>
                    <th
                      className="px-2 py-2 text-center cursor-pointer hover:bg-dark-surface transition-colors border-l border-amber-700/30"
                      onClick={() => handleSort("block_match_all")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Block <SortIcon field="block_match_all" />
                      </div>
                    </th>
                    <th
                      className="px-2 py-2 text-center cursor-pointer hover:bg-dark-surface transition-colors"
                      onClick={() => handleSort("text_all")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Text <SortIcon field="text_all" />
                      </div>
                    </th>
                    <th
                      className="px-2 py-2 text-center cursor-pointer hover:bg-dark-surface transition-colors"
                      onClick={() => handleSort("position_all")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Pos <SortIcon field="position_all" />
                      </div>
                    </th>
                    <th
                      className="px-2 py-2 text-center cursor-pointer hover:bg-dark-surface transition-colors"
                      onClick={() => handleSort("color_all")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Color <SortIcon field="color_all" />
                      </div>
                    </th>
                    <th
                      className="px-2 py-2 text-center cursor-pointer hover:bg-dark-surface transition-colors"
                      onClick={() => handleSort("fg_clip_all")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        FG-Clip <SortIcon field="fg_clip_all" />
                      </div>
                    </th>
                    <th
                      className="px-2 py-2 text-center cursor-pointer hover:bg-dark-surface transition-colors border-l border-amber-700/30"
                      onClick={() => handleSort("vision_prompt_tokens_per_instance")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>
                          Vision
                          <br />
                          Tokens
                        </span>{" "}
                        <SortIcon field="vision_prompt_tokens_per_instance" />
                      </div>
                    </th>
                    <th
                      className="px-2 py-2 text-center cursor-pointer hover:bg-dark-surface transition-colors"
                      onClick={() => handleSort("text_prompt_tokens_per_instance")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>
                          Text
                          <br />
                          Tokens
                        </span>{" "}
                        <SortIcon field="text_prompt_tokens_per_instance" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((row, index) => {
                    const isSelected = selectedModels.some(
                      (m) => rowKey(m) === rowKey(row),
                    );
                    return (
                      <tr
                        key={index}
                        className={`border-b border-amber-100 transition-colors ${
                          isSelected
                            ? "bg-blue-50"
                            : index % 2 === 0
                              ? "bg-amber-50/30"
                              : ""
                        }`}
                      >
                        <td
                          className="px-2 py-2 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleModelSelection(row)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td
                          className="px-2 py-2 text-left font-medium text-gray-900"
                          title={
                            row.method && row.method.toLowerCase() !== "direct"
                              ? `${row.method}-${row.model}`
                              : row.model
                          }
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="min-w-0 truncate">
                              {row.method &&
                              row.method.toLowerCase() !== "direct" ? (
                                <>
                                  <span className="text-purple-600 capitalize">
                                    {row.method}
                                  </span>
                                  -{row.model}
                                </>
                              ) : (
                                row.model
                              )}
                            </span>
                            {row.run_id && trajectoryLinks[row.run_id] && (
                              <a
                                href={trajectoryLinks[row.run_id].tree_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                title="View trajectory & results on HuggingFace"
                                className="text-amber-600 hover:text-amber-700 shrink-0"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-2 py-2 text-center text-gray-500">
                          {row.model_date || "-"}
                        </td>
                        <td
                          className={`px-2 py-2 text-center ${sortField === "clip_all" ? "font-semibold text-blue-600" : "text-gray-700"}`}
                        >
                          {row.clip_all || row.clip}
                        </td>
                        <td
                          className={`px-2 py-2 text-center ${sortField === "code_similarity_all" ? "font-semibold text-blue-600" : "text-gray-700"}`}
                        >
                          {row.code_similarity_all || row.code_similarity}
                        </td>
                        <td
                          className={`px-2 py-2 text-center ${sortField === "block_match_all" ? "font-semibold text-blue-600" : "text-gray-700"}`}
                        >
                          {row.block_match_all || row.block_match}
                        </td>
                        <td
                          className={`px-2 py-2 text-center ${sortField === "text_all" ? "font-semibold text-blue-600" : "text-gray-700"}`}
                        >
                          {row.text_all || row.text}
                        </td>
                        <td
                          className={`px-2 py-2 text-center ${sortField === "position_all" ? "font-semibold text-blue-600" : "text-gray-700"}`}
                        >
                          {row.position_all || row.position}
                        </td>
                        <td
                          className={`px-2 py-2 text-center ${sortField === "color_all" ? "font-semibold text-blue-600" : "text-gray-700"}`}
                        >
                          {row.color_all || row.color}
                        </td>
                        <td
                          className={`px-2 py-2 text-center ${sortField === "fg_clip_all" ? "font-semibold text-blue-600" : "text-gray-700"}`}
                        >
                          {row.fg_clip_all || row.fg_clip}
                        </td>
                        <td
                          className={`px-2 py-2 text-center ${sortField === "vision_prompt_tokens_per_instance" ? "font-semibold text-blue-600" : "text-gray-700"}`}
                        >
                          {row.vision_prompt_tokens_per_instance
                            ? Number(row.vision_prompt_tokens_per_instance).toFixed(0)
                            : "-"}
                        </td>
                        <td
                          className={`px-2 py-2 text-center ${sortField === "text_prompt_tokens_per_instance" ? "font-semibold text-blue-600" : "text-gray-700"}`}
                        >
                          {row.text_prompt_tokens_per_instance
                            ? Number(row.text_prompt_tokens_per_instance).toFixed(0)
                            : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <CompareModelsDialog
        open={showCompareDialog}
        onOpenChange={setShowCompareDialog}
        selectedModels={selectedModels}
      />
    </>
  );
}
