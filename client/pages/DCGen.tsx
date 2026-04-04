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

export default function DCGen() {
  // Fetch data from GitHub repository
  // For demo, we'll use local example data
  const { data, loading, error, refetch } = useGitHubData('dcgen', {
    autoFetch: false // Set to true when you have a real GitHub repo configured
  });

  // Demo data from local file
  const [demoData, setDemoData] = React.useState<any>(null);
  const [demoLoading, setDemoLoading] = React.useState(true);

  React.useEffect(() => {
    // Load example data from public folder
    fetch('/example-data/dcgen-results.json')
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
              <div className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-6 rounded-xl border border-[#E9D4FF] bg-white/70">
                <div className="flex w-10 h-10 items-center justify-center rounded-full bg-blue-light flex-shrink-0">
                  <Lightbulb
                    className="w-5 h-5 text-blue-primary"
                    strokeWidth={1.67}
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <h2 className="text-blue-primary font-bold text-base sm:text-lg leading-7">
                    Overview
                  </h2>
                  <img
                    src="/shared/DCGen.png"
                    alt="DCGen Overview"
                    className="mt-4 w-full rounded-lg"
                  />
                  <div className="text-text-secondary text-sm sm:text-base leading-relaxed sm:leading-[26px]">
                    Websites are critical in today's digital world, with over 1.11 billion currently active and approximately 252,000 new sites launched daily. Converting website layout design into functional UI code is a time-consuming yet indispensable step of website development. Manual methods of converting visual designs into functional code present significant challenges, especially for non-experts. To explore automatic design-to-code solutions, we first conduct a motivating study on GPT-4o and identify three types of issues in generating UI code: element omission, element distortion, and element misarrangement. We further reveal that a focus on smaller visual segments can help multimodal large language models (MLLMs) mitigate these failures in the generation process.
                    <br />
                    <br />
                    In this paper, we propose DCGen, a divide-and-conquer-based approach to automate the translation of webpage design to UI code. DCGen starts by dividing screenshots into manageable segments, generating code for each segment, and then reassembling them into complete UI code for the entire screenshot. We conduct extensive testing with a dataset comprised of real-world websites and various MLLMs and demonstrate that DCGen achieves up to a 15% improvement in visual similarity and 8% in code similarity for large input images. Human evaluations show that DCGen can help developers implement webpages significantly faster and more similar to the UI designs. To the best of our knowledge, DCGen is the first segment-aware MLLM-based approach for generating UI code directly from screenshots.
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
