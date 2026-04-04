import React from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { useGitHubData } from "@/hooks/useGitHubData";
import {
  Lightbulb,
  Check,
  Code,
  MessageSquare,
  ArrowRight,
  DollarSign,
  Repeat,
  Zap,
  FileText,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Interaction2Code() {
  // Fetch data from GitHub repository
  // For demo, we'll use local example data
  const { data, loading, error, refetch } = useGitHubData('interaction2code', {
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
      <div className="ml-64 pt-28 pb-12">
        <main className="flex justify-center">
          <div className="w-full max-w-6xl px-8 lg:px-12">
            <div className="flex flex-col gap-6 sm:gap-8">
            {/* Introduction */}
            <div className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-6 rounded-xl border border-amber-200/50 bg-card">
              <div className="flex w-10 h-10 items-center justify-center rounded-full bg-amber-100 flex-shrink-0">
                <Lightbulb
                  className="w-5 h-5 text-amber-600"
                  strokeWidth={1.67}
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <h2 className="text-blue-primary font-bold text-base sm:text-lg leading-7">
                    Overview
                  </h2>
                  <img
                    src="/shared/Interaction2Code.png"
                    alt="DCGen Overview"
                    className="mt-4 w-full rounded-lg"
                  />
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
        </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}