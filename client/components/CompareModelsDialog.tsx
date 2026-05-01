import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Radar, Grid3X3, TrendingUp, Settings2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface ModelData {
  model: string;
  method?: string;
  run_id?: string;
  [key: string]: any;
}

interface CompareModelsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedModels: ModelData[];
}

export function CompareModelsDialog({
  open,
  onOpenChange,
  selectedModels,
}: CompareModelsDialogProps) {
  // Non-metric fields to exclude from comparison charts
  const excludedKeys = new Set([
    'model', 'date', 'org', 'tags', 'rank', 'name', 'id', 'url', 'link',
    'description', 'category', 'type', 'version', 'source', 'organization',
    'submitted', 'verified', 'notes', 'method', 'paper', 'code', 'website', 'dataset', 
    'run_id'
  ]);

  // Extract only numeric metric keys from the first model
  const getAllMetricKeys = (): string[] => {
    if (selectedModels.length === 0) return [];
    const firstModel = selectedModels[0];
    return Object.keys(firstModel).filter((key) => {
      // Exclude known non-metric fields
      if (excludedKeys.has(key.toLowerCase())) return false;
      
      const value = firstModel[key];
      // Only include if value is numeric or a numeric string (like "85.5%")
      if (typeof value === 'number') return true;
      if (typeof value === 'string') {
        const parsed = parseFloat(value.replace('%', '').replace(/[^0-9.-]/g, ''));
        return !isNaN(parsed);
      }
      return false;
    });
  };

  const allMetricKeys = getAllMetricKeys();

  // Metric presets for quick analysis
  const metricPresets: { label: string; description: string; keys: string[] }[] = [
    {
      label: 'Key Metrics',
      description: 'Core evaluation metrics (recommended)',
      keys: ['clip_all', 'code_similarity_all', 'block_match_all', 'text_all', 'position_all', 'color_all', 'fg_clip_all'],
    },
    {
      label: 'Visual Similarity',
      description: 'Image-level visual comparison',
      keys: ['clip_all', 'clip', 'fg_clip_all', 'fg_clip'],
    },
    {
      label: 'Fine-Grained',
      description: 'Element-level design accuracy',
      keys: ['block_match_all', 'text_all', 'position_all', 'color_all', 'fg_clip_all'],
    },
    {
      label: 'Code Quality',
      description: 'Source code comparison',
      keys: ['code_similarity_all', 'code_similarity'],
    },
    {
      label: 'Token Usage',
      description: 'Cost & efficiency metrics',
      keys: ['vision_prompt_tokens_per_instance', 'text_prompt_tokens_per_instance', 'response_tokens_per_instance'],
    },
    {
      label: 'All Metrics',
      description: 'Every available metric',
      keys: allMetricKeys,
    },
  ];

  // Default to "Key Metrics" preset — only metrics that actually exist in the data
  const getDefaultMetrics = () => {
    const keyMetrics = metricPresets[0].keys;
    return new Set(keyMetrics.filter(k => allMetricKeys.includes(k)));
  };

  // State for selected metrics
  const [selectedMetrics, setSelectedMetrics] = useState<Set<string>>(getDefaultMetrics());
  const [showMetricSelector, setShowMetricSelector] = useState(false);

  // Reset to default preset when dialog opens or models change
  useEffect(() => {
    if (open) {
      setSelectedMetrics(getDefaultMetrics());
    }
  }, [open, selectedModels]);

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(metric)) {
        newSet.delete(metric);
      } else {
        newSet.add(metric);
      }
      return newSet;
    });
  };

  const applyPreset = (preset: typeof metricPresets[number]) => {
    setSelectedMetrics(new Set(preset.keys.filter(k => allMetricKeys.includes(k))));
  };

  const selectAllMetrics = () => setSelectedMetrics(new Set(allMetricKeys));
  const deselectAllMetrics = () => setSelectedMetrics(new Set());

  // Only use selected metrics for charts
  const metricKeys = allMetricKeys.filter(k => selectedMetrics.has(k));

  const getModelKey = (model: ModelData): string => {
    return model.run_id || `${model.method || "-"}__${model.model}`;
  };

  const getMethodLabel = (model: ModelData): string => {
    const method = String(model.method || "").trim();
    if (!method || method === "-") return "";
    return method.charAt(0).toUpperCase() + method.slice(1);
  };

  const getModelLabel = (model: ModelData): string => {
    const method = getMethodLabel(model);
    if (!method) return model.model;
    return `${method} - ${model.model}`;
  };

  const formatMetricName = (key: string): string => {
    return key
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getNumericValue = (value: any): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'string') {
      const parsed = parseFloat(value.replace('%', '').replace(/[^0-9.-]/g, ''));
      return isNaN(parsed) ? 0 : parsed;
    }
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  const colors = [
    { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-600', hex: '#3b82f6', fill: 'rgba(59, 130, 246, 0.2)' },
    { bg: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-emerald-600', hex: '#10b981', fill: 'rgba(16, 185, 129, 0.2)' },
    { bg: 'bg-violet-500', border: 'border-violet-500', text: 'text-violet-600', hex: '#8b5cf6', fill: 'rgba(139, 92, 246, 0.2)' },
    { bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-600', hex: '#f97316', fill: 'rgba(249, 115, 22, 0.2)' },
    { bg: 'bg-pink-500', border: 'border-pink-500', text: 'text-pink-600', hex: '#ec4899', fill: 'rgba(236, 72, 153, 0.2)' },
    { bg: 'bg-cyan-500', border: 'border-cyan-500', text: 'text-cyan-600', hex: '#06b6d4', fill: 'rgba(6, 182, 212, 0.2)' },
    { bg: 'bg-red-500', border: 'border-red-500', text: 'text-red-600', hex: '#ef4444', fill: 'rgba(239, 68, 68, 0.2)' },
    { bg: 'bg-amber-500', border: 'border-amber-500', text: 'text-amber-600', hex: '#f59e0b', fill: 'rgba(245, 158, 11, 0.2)' },
  ];

  // Radar Chart Component (SVG-based)
  const RadarChart = () => {
    const centerX = 150;
    const centerY = 150;
    const radius = 100;
    const numAxes = metricKeys.length;
    
    if (numAxes < 3) return <div className="text-center text-gray-500 py-8">Need at least 3 metrics for radar chart</div>;
    
    const angleStep = (2 * Math.PI) / numAxes;
    
    // Calculate max value for each metric for normalization
    const maxValues = metricKeys.reduce((acc, key) => {
      const values = selectedModels.map(m => getNumericValue(m[key]));
      const max = Math.max(...values);
      acc[key] = max > 0 ? max : 100; // Prevent division by zero
      return acc;
    }, {} as Record<string, number>);
    
    // Get axis endpoints
    const getAxisPoint = (index: number, value: number = 1) => {
      const angle = index * angleStep - Math.PI / 2;
      return {
        x: centerX + radius * value * Math.cos(angle),
        y: centerY + radius * value * Math.sin(angle),
      };
    };

    // Generate grid circles
    const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
    
    return (
      <div className="flex flex-col items-center">
        <svg width="300" height="300" viewBox="0 0 300 300">
          {/* Grid circles */}
          {gridLevels.map((level) => (
            <polygon
              key={level}
              points={metricKeys.map((_, i) => {
                const p = getAxisPoint(i, level);
                return `${p.x},${p.y}`;
              }).join(' ')}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Axis lines */}
          {metricKeys.map((_, i) => {
            const p = getAxisPoint(i);
            return (
              <line
                key={i}
                x1={centerX}
                y1={centerY}
                x2={p.x}
                y2={p.y}
                stroke="#d1d5db"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Data polygons for each model */}
          {selectedModels.map((model, modelIdx) => {
            const points = metricKeys.map((key, i) => {
              const rawValue = getNumericValue(model[key]);
              const normalizedValue = rawValue / maxValues[key];
              const value = Math.min(normalizedValue, 1);
              const p = getAxisPoint(i, value);
              return `${p.x},${p.y}`;
            }).join(' ');
            
            return (
              <g key={getModelKey(model)}>
                <polygon
                  points={points}
                  fill={colors[modelIdx % colors.length].fill}
                  stroke={colors[modelIdx % colors.length].hex}
                  strokeWidth="2"
                />
                {/* Data points */}
                {metricKeys.map((key, i) => {
                  const rawValue = getNumericValue(model[key]);
                  const normalizedValue = rawValue / maxValues[key];
                  const value = Math.min(normalizedValue, 1);
                  const p = getAxisPoint(i, value);
                  return (
                    <circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r="4"
                      fill={colors[modelIdx % colors.length].hex}
                    >
                      <title>{`${getModelLabel(model)} - ${formatMetricName(key)}: ${rawValue}`}</title>
                    </circle>
                  );
                })}
              </g>
            );
          })}
          
          {/* Axis labels */}
          {metricKeys.map((key, i) => {
            const p = getAxisPoint(i, 1.25);
            return (
              <text
                key={i}
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[10px] fill-gray-600 font-medium"
              >
                {formatMetricName(key).slice(0, 12)}
              </text>
            );
          })}
        </svg>
        
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {selectedModels.map((model, idx) => (
            <div key={getModelKey(model)} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${colors[idx % colors.length].bg}`} />
              <span className="text-xs font-medium text-gray-700">{getModelLabel(model)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Grouped Bar Chart Component
  const GroupedBarChart = () => {
    const allValues = selectedModels.flatMap((m) => metricKeys.map((k) => getNumericValue(m[k]))).filter(v => !isNaN(v) && isFinite(v));
    const maxValue = allValues.length > 0 ? Math.max(...allValues, 1) : 100;
    const safeMaxValue = isNaN(maxValue) || !isFinite(maxValue) || maxValue <= 0 ? 100 : maxValue;
    
    if (metricKeys.length === 0) {
      return <div className="text-center text-gray-500 py-8">No metrics available</div>;
    }
    
    return (
      <div className="space-y-4">
        {/* Chart area */}
        <div className="relative border-l-2 border-b-2 border-gray-300 ml-12 mr-4">
          {/* Y-axis labels */}
          <div className="absolute -left-12 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 py-1">
            <span>{safeMaxValue.toFixed(0)}</span>
            <span>{(safeMaxValue / 2).toFixed(0)}</span>
            <span>0</span>
          </div>
          
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className="border-t border-gray-200 border-dashed" />
            <div className="border-t border-gray-200 border-dashed" />
          </div>
          
          {/* Bars */}
          <div className="flex items-end justify-around h-[220px] py-2 px-2">
            {metricKeys.map((key) => (
              <div key={key} className="flex flex-col items-center flex-1 max-w-[120px]">
                <div className="flex items-end gap-[2px] h-[180px]">
                  {selectedModels.map((model, modelIdx) => {
                    const value = getNumericValue(model[key]);
                    const height = safeMaxValue > 0 ? (value / safeMaxValue) * 180 : 0;
                    
                    return (
                      <div
                        key={getModelKey(model)}
                        className="relative group"
                        style={{ width: `${Math.max(16, 50 / selectedModels.length)}px` }}
                      >
                        <div
                          className={`w-full ${colors[modelIdx % colors.length].bg} rounded-t-sm transition-all hover:opacity-80 cursor-pointer`}
                          style={{ height: `${Math.max(height, 2)}px` }}
                        />
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-20 pointer-events-none">
                          {getModelLabel(model)}: {value.toFixed(1)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <span className="text-[10px] text-gray-600 mt-2 text-center leading-tight max-w-full truncate">
                  {formatMetricName(key)}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          {selectedModels.map((model, idx) => (
            <div key={getModelKey(model)} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${colors[idx % colors.length].bg}`} />
              <span className="text-sm font-medium text-gray-700">{getModelLabel(model)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Heatmap Component
  const HeatmapChart = () => {
    // Calculate min and max for each metric across selected models
    const metricRanges: Record<string, { min: number; max: number }> = {};
    metricKeys.forEach((key) => {
      const values = selectedModels.map((m) => getNumericValue(m[key])).filter(v => !isNaN(v));
      metricRanges[key] = {
        min: values.length > 0 ? Math.min(...values) : 0,
        max: values.length > 0 ? Math.max(...values) : 100,
      };
    });

    // Get gradient color based on min-max normalization
    const getGradientColor = (value: number, min: number, max: number): string => {
      // Normalize value between 0 and 1
      const range = max - min;
      const normalized = range > 0 ? (value - min) / range : 0.5;
      
      // Interpolate between red (low) -> yellow (mid) -> green (high)
      // Using RGB interpolation for smooth gradient
      let r: number, g: number, b: number;
      
      if (normalized <= 0.5) {
        // Red to Yellow (0 to 0.5)
        const t = normalized * 2;
        r = 239; // Keep red high
        g = Math.round(68 + (200 - 68) * t); // Increase green
        b = Math.round(68 + (50 - 68) * t); // Slight decrease in blue
      } else {
        // Yellow to Green (0.5 to 1)
        const t = (normalized - 0.5) * 2;
        r = Math.round(239 - (239 - 34) * t); // Decrease red
        g = Math.round(200 + (197 - 200) * t); // Keep green high
        b = Math.round(50 + (94 - 50) * t); // Slight increase in blue
      }
      
      const textColor = normalized > 0.4 && normalized < 0.7 ? 'text-gray-800' : 'text-white';
      return `${textColor}`;
    };

    const getBackgroundStyle = (value: number, min: number, max: number): React.CSSProperties => {
      const range = max - min;
      const normalized = range > 0 ? (value - min) / range : 0.5;
      
      let r: number, g: number, b: number;
      
      if (normalized <= 0.5) {
        const t = normalized * 2;
        r = 239;
        g = Math.round(68 + (200 - 68) * t);
        b = Math.round(68 + (50 - 68) * t);
      } else {
        const t = (normalized - 0.5) * 2;
        r = Math.round(239 - (239 - 34) * t);
        g = Math.round(200 + (197 - 200) * t);
        b = Math.round(50 + (94 - 50) * t);
      }
      
      return { backgroundColor: `rgb(${r}, ${g}, ${b})` };
    };

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-gray-600 bg-gray-100">Method / Model</th>
              {metricKeys.map((key) => (
                <th key={key} className="px-3 py-2 text-center font-semibold text-gray-600 bg-gray-100 whitespace-nowrap">
                  {formatMetricName(key).slice(0, 10)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedModels.map((model, idx) => (
              <tr key={getModelKey(model)}>
                <td className="px-3 py-2 font-medium text-gray-900 border-b">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${colors[idx % colors.length].bg}`} />
                    {getModelLabel(model)}
                  </div>
                </td>
                {metricKeys.map((key) => {
                  const value = getNumericValue(model[key]);
                  const { min, max } = metricRanges[key];
                  return (
                    <td
                      key={key}
                      className={`px-3 py-2 text-center font-semibold border-b ${getGradientColor(value, min, max)}`}
                      style={getBackgroundStyle(value, min, max)}
                    >
                      {value.toFixed(1)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Gradient color scale legend */}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs">
          <span className="text-gray-500">Min</span>
          <div 
            className="w-32 h-4 rounded"
            style={{
              background: 'linear-gradient(to right, rgb(239, 68, 68), rgb(239, 200, 50), rgb(34, 197, 94))'
            }}
          />
          <span className="text-gray-500">Max</span>
        </div>
      </div>
    );
  };

  // Ranking Chart Component - shows rank position per metric
  const RankingChart = () => {
    // Calculate rankings for each metric
    const rankings: Record<string, { modelKey: string; rank: number; value: number }[]> = {};
    
    metricKeys.forEach((key) => {
      const sorted = [...selectedModels]
        .map((m) => ({ modelKey: getModelKey(m), value: getNumericValue(m[key]) }))
        .sort((a, b) => b.value - a.value);
      
      rankings[key] = sorted.map((item, index) => ({
        ...item,
        rank: index + 1,
      }));
    });

    return (
      <div className="space-y-6">
        {selectedModels.map((model, modelIdx) => {
          const modelKey = getModelKey(model);
          const modelRanks = metricKeys.map((key) => {
            const ranking = rankings[key].find((r) => r.modelKey === modelKey);
            return { key, rank: ranking?.rank || 0, value: ranking?.value || 0 };
          });
          
          return (
            <div key={modelKey} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${colors[modelIdx % colors.length].bg}`} />
                <span className="font-semibold text-gray-800">{getModelLabel(model)}</span>
              </div>
              <div className="flex items-center gap-1">
                {modelRanks.map(({ key, rank }) => {
                  const medalColor = rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                                    rank === 2 ? 'bg-gray-300 text-gray-700' :
                                    rank === 3 ? 'bg-orange-400 text-orange-900' :
                                    'bg-gray-100 text-gray-600';
                  return (
                    <div key={key} className="flex flex-col items-center flex-1">
                      <div className={`w-8 h-8 rounded-full ${medalColor} flex items-center justify-center font-bold text-sm`}>
                        #{rank}
                      </div>
                      <span className="text-[9px] text-gray-500 mt-1 text-center leading-tight">
                        {formatMetricName(key).slice(0, 8)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        
        {/* Summary: Total #1 positions */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">🏆 First Place Counts</h4>
          <div className="flex flex-wrap gap-3">
            {selectedModels.map((model, idx) => {
              const modelKey = getModelKey(model);
              const firstPlaceCount = metricKeys.filter((key) => {
                const ranking = rankings[key].find((r) => r.modelKey === modelKey);
                return ranking?.rank === 1;
              }).length;
              
              return (
                <div key={modelKey} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${colors[idx % colors.length].bg}`} />
                  <span className="text-sm text-gray-700">{getModelLabel(model)}</span>
                  <span className="font-bold text-amber-600">{firstPlaceCount}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              Model Comparison ({selectedModels.length} models)
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMetricSelector(!showMetricSelector)}
              className="flex items-center gap-2"
            >
              <Settings2 className="w-4 h-4" />
              Select Metrics ({metricKeys.length}/{allMetricKeys.length})
            </Button>
          </div>
        </DialogHeader>

        {/* Quick Presets — always visible */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">Quick select:</span>
          {metricPresets.map((preset) => {
            const presetSet = new Set(preset.keys.filter(k => allMetricKeys.includes(k)));
            const isActive = presetSet.size > 0 &&
              presetSet.size === selectedMetrics.size &&
              [...presetSet].every(k => selectedMetrics.has(k));
            return (
              <button
                key={preset.label}
                onClick={() => applyPreset(preset)}
                title={preset.description}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Metric Selector (expandable) */}
        {showMetricSelector && (
          <div className="border rounded-lg p-4 bg-gray-50 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-sm text-gray-700">Individual metric selection:</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAllMetrics}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={deselectAllMetrics}>
                  Deselect All
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {allMetricKeys.map((metric) => (
                <label
                  key={metric}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedMetrics.has(metric)}
                    onCheckedChange={() => toggleMetric(metric)}
                  />
                  <span className="text-sm">{formatMetricName(metric)}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <Tabs defaultValue="bars" className="mt-4">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="bars" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Bar Chart</span>
            </TabsTrigger>
            <TabsTrigger value="radar" className="flex items-center gap-2">
              <Radar className="w-4 h-4" />
              <span className="hidden sm:inline">Radar</span>
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" />
              <span className="hidden sm:inline">Heatmap</span>
            </TabsTrigger>
            <TabsTrigger value="ranking" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Rankings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="radar">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Radar Chart Comparison</CardTitle>
                <p className="text-sm text-gray-500">Visualize all metrics at once for each model</p>
              </CardHeader>
              <CardContent>
                <RadarChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bars">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Grouped Bar Chart</CardTitle>
                <p className="text-sm text-gray-500">Compare models side-by-side for each metric</p>
              </CardHeader>
              <CardContent>
                <GroupedBarChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="heatmap">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Heatmap</CardTitle>
                <p className="text-sm text-gray-500">Color-coded performance matrix (green = best, red = worst)</p>
              </CardHeader>
              <CardContent>
                <HeatmapChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ranking">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Metric Rankings</CardTitle>
                <p className="text-sm text-gray-500">See how each model ranks across all metrics</p>
              </CardHeader>
              <CardContent>
                <RankingChart />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary Table - Always visible */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Detailed Comparison Table</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="px-4 py-3 text-left font-bold bg-gray-50 sticky left-0">
                      Method / Model
                    </th>
                    {metricKeys.map((key) => (
                      <th
                        key={key}
                        className="px-4 py-3 text-left font-semibold bg-gray-50 whitespace-nowrap"
                      >
                        {formatMetricName(key)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedModels.map((model, idx) => (
                    <tr
                      key={getModelKey(model)}
                      className={`border-b ${
                        idx % 2 === 0 ? 'bg-amber-50/30' : 'bg-white'
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 sticky left-0 bg-inherit">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${colors[idx % colors.length].bg}`} />
                          {getModelLabel(model)}
                        </div>
                      </td>
                      {metricKeys.map((key) => {
                        const value = model[key];
                        return (
                          <td
                            key={key}
                            className="px-4 py-3 text-gray-700 whitespace-nowrap"
                          >
                            {typeof value === 'string'
                              ? value
                              : getNumericValue(value).toFixed(2)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
