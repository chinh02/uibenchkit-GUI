import React from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { useGitHubData } from "@/hooks/useGitHubData";
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
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DesignBench() {
  // Fetch data from GitHub repository
  // For demo, we'll use local example data
  const { data, loading, error, refetch } = useGitHubData('designbench', {
    autoFetch: false // Set to true when you have a real GitHub repo
  });

  // Demo data from local file
  const [demoData, setDemoData] = React.useState<any>(null);
  const [demoLoading, setDemoLoading] = React.useState(true);

  React.useEffect(() => {
    // Load example data from public folder
    fetch('/example-data/interaction2code-results.json')
      .then(res => res.json())
      .then(data => {
        setDemoData(data);
        setDemoLoading(false);
      })
      .catch(err => {
        console.error('Error loading demo data:', err);
        setDemoLoading(false);
      });
  }, []);

  const leaderboardData = data?.results || demoData?.results || [];
  const isLoading = loading || demoLoading;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <div className="ml-64 pt-24 sm:pt-28 pb-12">
        <main className="max-w-[1000px] mx-auto px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:gap-8">
            <div className="mb-4">
              <h1 className="text-4xl font-bold text-text-primary mb-4">DesignBench</h1>
              <p className="text-lg text-text-secondary">
                Comprehensive design-to-code evaluation benchmark.
              </p>
            </div>
            
            {/* Repository Organization */}
            <div className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-6 rounded-xl border border-[#E9D4FF] bg-[rgba(173,70,255,0.05)] mb-6">
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
            </div>

            {/* Introduction */}
            <div className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-6 rounded-xl border border-[#E9D4FF] bg-white/70 mb-6">
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
                  DesignBench provides a comprehensive evaluation framework for assessing 
                  design-to-code capabilities. It includes various design patterns, 
                  complexity levels, and evaluation metrics.
                  <br />
                  <br />
                  The benchmark encompasses comprehensive design patterns, multi-metric evaluation, 
                  complexity scaling, and best practice validation across different design systems and frameworks.
                </div>
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/42432a6e4f96f2fd81ce1965c738974bfad80037?width=1484"
                  alt="DesignBench Overview"
                  className="mt-4 w-full rounded-lg"
                />
              </div>
            </div>

            {/* Leaderboard Section */}
            <div className="mt-8 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Leaderboard Results
                </h2>
                <Button
                  onClick={refetch}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  className="gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh Data
                </Button>
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-red-700 text-sm">
                    Error loading data: {error.message}
                  </p>
                </div>
              )}

              <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <LeaderboardTable data={leaderboardData} loading={isLoading} />
              </div>

              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>💡 Note:</strong> This demo uses example data from{' '}
                  <code className="px-1 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-xs">
                    /example-data/interaction2code-results.json
                  </code>
                  . To use real GitHub data, configure your repository in{' '}
                  <code className="px-1 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-xs">
                    client/lib/githubData.ts
                  </code>{' '}
                  and set <code className="px-1 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-xs">autoFetch: true</code>.
                  See{' '}
                  <a href="/GITHUB_DATA_SETUP.md" className="underline font-medium text-amber-700">
                    GITHUB_DATA_SETUP.md
                  </a>{' '}
                  for details.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
