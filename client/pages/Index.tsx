import React from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import {
  Lightbulb,
  Check,
  Package,
  Code,
  MessageSquare,
  ArrowRight,
  Star,
  DollarSign,
  Repeat,
  Zap,
  FileText,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

type SortField = 'model' | 'clip' | 'ssim' | 'text' | 'position' | 'ir' | 'overall';
type SortDirection = 'asc' | 'desc';

export default function Index() {
  // Fetch leaderboard data from JSON file
  const [demoData, setDemoData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [sortField, setSortField] = React.useState<SortField>('overall');
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc');

  React.useEffect(() => {
    // Load data from public folder
    fetch('/example-data/interaction2code-results.json')
      .then(res => res.json())
      .then(data => {
        setDemoData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading data:', err);
        setLoading(false);
      });
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'model' ? 'asc' : 'desc');
    }
  };

  const sortData = (data: any[]) => {
    return [...data].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];
      
      // Convert percentage strings to numbers for comparison
      if (typeof aVal === 'string' && aVal.includes('%')) {
        aVal = parseFloat(aVal.replace('%', ''));
        bVal = parseFloat(bVal.replace('%', ''));
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();
      
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

  const leaderboardData = demoData?.results ? sortData(demoData.results) : [];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />

      <div className="ml-64 pt-24 sm:pt-28 pb-12">
        <main className="max-w-[1000px] mx-auto px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* Hero Section */}
            <div className="flex flex-col items-center gap-4 self-stretch">
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
            </div>

            {/* <div className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-6 rounded-xl border border-[#E9D4FF] bg-[rgba(173,70,255,0.05)]">
              <div className="flex w-10 h-10 items-center justify-center rounded-full bg-[#F3E8FF] flex-shrink-0">
                <Lightbulb
                  className="w-5 h-5 text-[#9810FA]"
                  strokeWidth={1.67}
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <h2 className="text-[#8200DB] font-bold text-base sm:text-lg leading-7">
                  Repository Organization
                </h2>
                <div className="text-text-secondary text-sm sm:text-base leading-relaxed sm:leading-[26px]">
                  This repository contains:
                  <br />
                  <strong>Dataset.</strong> The sample of our experiment data is
                  available in /sample. We will release the full dataset as soon
                  as the paper is published.
                  <br />
                  <strong>Codes.</strong> The code is available in /code,
                  including the interactive webpage generation, metric
                  calculation and annotation.
                  <br />
                  <strong>Human evaluation results.</strong> The results of
                  human evaluation are in /huamn_evalauation. We will release
                  the full human evaluation results as soon as the paper is
                  published.
                  <br />
                  <strong>Demo video.</strong> In assets/video.mov
                </div>
              </div>
            </div> */}

            
            {/* <div className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-6 rounded-xl border border-[#E9D4FF] bg-white/70">
              <div className="flex w-10 h-10 items-center justify-center rounded-full bg-blue-light flex-shrink-0">
                <Lightbulb
                  className="w-5 h-5 text-blue-primary"
                  strokeWidth={1.67}
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <h2 className="text-blue-primary font-bold text-base sm:text-lg leading-7">
                  Introduction
                </h2>
                <div className="text-text-secondary text-sm sm:text-base leading-relaxed sm:leading-[26px]">
                  Multimodal Large Language Models (MLLMs) have demonstrated
                  remarkable performance on the design-to-code task, i.e.,
                  generating UI code from UI mock-ups. However, existing
                  benchmarks only contain static web pages for evaluation and
                  ignore the dynamic interaction, limiting the practicality,
                  usability and user engagement of the generated webpages.
                  <br />
                  <br />
                  To bridge these gaps, we present the first systematic
                  investigation of MLLMs in generating interactive webpages.
                  Specifically, we formulate the Interaction-to-Code task and
                  establish the Interaction2Code benchmark, encompassing 127
                  unique webpages and 374 distinct interactions across 15
                  webpage types and 31 interaction categories. Through
                  comprehensive experiments utilizing state-of-the-art (SOTA)
                  MLLMs, evaluated via both automatic metrics and human
                  assessments, we identify four critical limitations of MLLM on
                  Interaction-to-Code task.
                </div>
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/42432a6e4f96f2fd81ce1965c738974bfad80037?width=1484"
                  alt="Interaction2Code Overview"
                  className="mt-4 w-full rounded-lg"
                />
              </div>
            </div> */}

            {/* Quick Start Guide */}
            

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
                  <button className="px-3 sm:px-4 py-2 rounded-xl border border-amber-400 bg-amber-500 text-dark-bg font-semibold text-xs sm:text-sm whitespace-nowrap">
                    Interaction2Code
                  </button>
                  <button className="px-3 sm:px-4 py-2 rounded-xl border border-amber-200 bg-white text-text-primary font-medium text-xs sm:text-sm hover:border-amber-400 transition-colors whitespace-nowrap">
                    MRWeb
                  </button>
                  <button className="px-3 sm:px-4 py-2 rounded-xl border border-amber-200 bg-white text-text-primary font-medium text-xs sm:text-sm hover:border-amber-400 transition-colors whitespace-nowrap">
                    DCGen
                  </button>
                  <button className="px-3 sm:px-4 py-2 rounded-xl border border-amber-200 bg-white text-text-primary font-medium text-xs sm:text-sm hover:border-amber-400 transition-colors whitespace-nowrap">
                    Design2Code
                  </button>
                  <button className="px-3 sm:px-4 py-2 rounded-xl border border-amber-200 bg-white text-text-primary font-medium text-xs sm:text-sm hover:border-amber-400 transition-colors whitespace-nowrap">
                    DesignBench
                  </button>
                </div>
              </div>

              {/* Leaderboard Table - Scrollable on mobile */}
              <div className="p-2 sm:p-4 overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center p-12">
                    <div className="text-text-muted">Loading leaderboard data...</div>
                  </div>
                ) : leaderboardData.length === 0 ? (
                  <div className="flex items-center justify-center p-12">
                    <div className="text-text-muted">No data available</div>
                  </div>
                ) : (
                  <div className="rounded-lg bg-white overflow-hidden min-w-[800px]">
                    <div className="flex items-center justify-between px-4 py-2.5 rounded-md bg-dark-bg text-amber-100">
                      <div 
                        className="w-64 sm:w-72 font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer hover:bg-dark-surface px-2 py-1 rounded transition-colors"
                        onClick={() => handleSort('model')}
                      >
                        Model
                        <SortIcon field="model" />
                      </div>
                      <div 
                        className="w-20 sm:w-24 font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer hover:bg-dark-surface px-2 py-1 rounded transition-colors"
                        onClick={() => handleSort('clip')}
                      >
                        Clip
                        <SortIcon field="clip" />
                      </div>
                      <div 
                        className="w-20 sm:w-24 font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer hover:bg-dark-surface px-2 py-1 rounded transition-colors"
                        onClick={() => handleSort('ssim')}
                      >
                        SSIM
                        <SortIcon field="ssim" />
                      </div>
                      <div 
                        className="w-20 sm:w-24 font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer hover:bg-dark-surface px-2 py-1 rounded transition-colors"
                        onClick={() => handleSort('text')}
                      >
                        Text
                        <SortIcon field="text" />
                      </div>
                      <div 
                        className="w-20 sm:w-24 font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer hover:bg-dark-surface px-2 py-1 rounded transition-colors"
                        onClick={() => handleSort('position')}
                      >
                        Position
                        <SortIcon field="position" />
                      </div>
                      <div 
                        className="w-20 sm:w-28 font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer hover:bg-dark-surface px-2 py-1 rounded transition-colors"
                        onClick={() => handleSort('ir')}
                      >
                        IR
                        <SortIcon field="ir" />
                      </div>
                      <div 
                        className="w-20 sm:w-24 font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer hover:bg-dark-surface px-2 py-1 rounded transition-colors"
                        onClick={() => handleSort('overall')}
                      >
                        Overall
                        <SortIcon field="overall" />
                      </div>
                    </div>
                    {leaderboardData.map((row, index) => (
                      <div key={index}>
                        <div
                          className={`flex items-center justify-between px-4 py-3 sm:py-4 ${index % 2 === 0 ? "bg-amber-50/50" : ""}`}
                        >
                          <div className="w-64 sm:w-72 text-text-primary font-medium text-xs sm:text-sm truncate">
                            {row.model}
                          </div>
                          <div className="w-20 sm:w-24 text-text-secondary font-medium text-xs sm:text-sm">
                            {row.clip}
                          </div>
                          <div className="w-20 sm:w-24 text-text-secondary font-medium text-xs sm:text-sm">
                            {row.ssim}
                          </div>
                          <div className="w-20 sm:w-24 text-text-secondary font-medium text-xs sm:text-sm">
                            {row.text}
                          </div>
                          <div className="w-20 sm:w-24 text-text-secondary font-medium text-xs sm:text-sm">
                            {row.position}
                          </div>
                          <div className="w-20 sm:w-28 text-text-secondary font-medium text-xs sm:text-sm">
                            {row.ir}
                          </div>
                          <div className="w-20 sm:w-24 text-amber-600 font-semibold text-xs sm:text-sm">
                            {row.overall}
                          </div>
                        </div>
                        {index < leaderboardData.length - 1 && (
                          <div className="h-px bg-amber-100" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* CCS - Claude Code Switch */}
            <div className="flex flex-col rounded-xl border border-amber-200 bg-card shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 bg-gradient-to-r from-amber-100/50 to-amber-50/30">
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                    <div className="px-3 py-1 rounded-full border border-amber-300/50 bg-amber-100">
                      <span className="text-amber-700 font-bold text-xs leading-4">
                        POWER TOOL
                      </span>
                    </div>
                    <h2 className="text-amber-700 font-bold text-lg sm:text-xl leading-7">
                      CCS - Claude Code Switch
                    </h2>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed sm:leading-[22.75px]">
                    Need to switch between work/personal accounts or use cheaper
                    models like Gemini/GLM? CCS is a powerful wrapper for Claude
                    Code that saves you money and streamlines your workflow.
                  </p>
                  <div className="flex items-center gap-3 sm:gap-4 flex-wrap mt-2">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-text-muted" />
                      <span className="text-text-muted text-xs">
                        Save ~80% costs
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Repeat className="w-3 h-3 text-text-muted" />
                      <span className="text-text-muted text-xs">
                        Multi-account
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-text-muted" />
                      <span className="text-text-muted text-xs">
                        Fast delegation
                      </span>
                    </div>
                  </div>
                </div>
                <a
                  href="#ccs-guide"
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-amber-200 bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] hover:shadow-lg transition-shadow whitespace-nowrap"
                >
                  <span className="text-amber-700 font-bold text-sm sm:text-base leading-6">
                    View CCS Guide
                  </span>
                  <ArrowRight className="w-4 h-4 text-amber-700" />
                </a>
              </div>
            </div>

            {/* Pro Tips for CLI Power Users */}
            <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-8 rounded-2xl border border-amber-200/50 bg-card shadow-sm">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex p-2 sm:p-3 rounded-xl bg-amber-100">
                  <Lightbulb
                    className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600"
                    strokeWidth={2}
                  />
                </div>
                <h2 className="text-text-primary font-semibold text-base sm:text-lg leading-7">
                  Pro Tips for CLI Power Users
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg border border-amber-100 bg-amber-50/50">
                  <Code
                    className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 flex-shrink-0 mt-0.5"
                    strokeWidth={2}
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="text-text-primary font-medium text-sm">
                      Use Quotes for Multi-word Requests
                    </h3>
                    <p className="text-text-secondary text-xs leading-4">
                      Always wrap your requests in double quotes: "your request
                      here"
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg border border-amber-100 bg-amber-50/50">
                  <MessageSquare
                    className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 flex-shrink-0 mt-0.5"
                    strokeWidth={2}
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="text-text-primary font-medium text-sm">
                      Interactive Mode = Better Iteration
                    </h3>
                    <p className="text-text-secondary text-xs leading-4">
                      Use{" "}
                      <code className="px-1 py-0.5 rounded bg-amber-100 text-amber-700 font-mono text-xs">
                        ccs
                      </code>{" "}
                      without arguments for back-and-forth refinement
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg border border-amber-100 bg-amber-50/50">
                  <FileText
                    className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 flex-shrink-0 mt-0.5"
                    strokeWidth={2}
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="text-text-primary font-medium text-sm">
                      Reference Files with @
                    </h3>
                    <p className="text-text-secondary text-xs leading-4">
                      Use{" "}
                      <code className="px-1 py-0.5 rounded bg-amber-100 text-amber-700 font-mono text-xs">
                        @filename
                      </code>{" "}
                      to tell AI which files to modify
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg border border-amber-100 bg-amber-50/50">
                  <Star
                    className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 flex-shrink-0 mt-0.5"
                    strokeWidth={2}
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="text-text-primary font-medium text-sm">
                      Always Use "Using ui-ux-pro-max skill"
                    </h3>
                    <p className="text-text-secondary text-xs leading-4">
                      This activates the design intelligence system for
                      professional results
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
