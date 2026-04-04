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

export default function Design2Code() {
  // Fetch data from GitHub repository (chinh02/web-bench-experiments)
  const { data, loading, error, refetch } = useGitHubData('design2code', {
    autoFetch: true // Fetch from GitHub repo
  });

  const leaderboardData = data?.results || [];
  const isLoading = loading;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <div className="ml-64 pt-28 pb-12">
        <main className="flex justify-center">
          <div className="w-full max-w-6xl px-8 lg:px-12">
            <div className="flex flex-col gap-6 sm:gap-8">
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
                    Overview
                  </h2>
                  <img
                    src="/shared/design-to-code.png"
                    alt="Design2Code Overview"
                    className="mt-4 w-full rounded-lg"
                  />
                  <div className="text-text-secondary text-sm sm:text-base leading-relaxed sm:leading-[26px]">
                    Generative AI has made rapid advancements in recent years, achieving unprecedented capabilities in multimodal understanding and code generation. This can enable a new paradigm of front-end development in which multimodal large language models (MLLMs) directly convert visual designs into code implementations. In this work, we construct Design2Code - the first real-world benchmark for this task. 
                    <br />
                    <br />
                   Specifically, we manually curate 484 diverse real-world webpages as test cases and develop a set of automatic evaluation metrics to assess how well current multimodal LLMs can generate the code implementations that directly render into the given reference webpages, given the screenshots as input. We also complement automatic metrics with comprehensive human evaluations to validate the performance ranking. To rigorously benchmark MLLMs, we test various multimodal prompting methods on frontier models such as GPT-4o, GPT-4V, Gemini, and Claude. Our fine-grained break-down metrics indicate that models mostly lag in recalling visual elements from the input webpages and generating correct layout designs.
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
                    <strong>💡 Note:</strong> Data is loaded from{' '}
                    <a 
                      href="https://github.com/chinh02/web-bench-experiments/blob/main/leaderboard/design2code-results.json"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium text-blue-700 hover:text-blue-800"
                    >
                      design2code-results.json
                    </a>
                    {' '}on GitHub.
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
