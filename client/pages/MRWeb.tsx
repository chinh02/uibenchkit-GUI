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

export default function MRWeb() {
  // Fetch data from GitHub repository
  // For demo, we'll use local example data
  const { data, loading, error, refetch } = useGitHubData('mrweb', {
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
              <h1 className="text-4xl font-bold text-text-primary mb-4">MRWeb</h1>
              <p className="text-lg text-text-secondary">
                Converting user interactions into executable code.
              </p>
            </div>
            
            {/* Repository Organization */}
            <div className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-6 rounded-xl border border-[#E9D4FF] bg-[rgba(173,70,255,0.05)]">
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
            <div className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-6 rounded-xl border border-[#E9D4FF] bg-white/70">
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
            </div>
            <div className="flex flex-col rounded-xl border border-[#E2E8F0] bg-white/80 shadow-sm">
              <div className="flex flex-col gap-2 p-4 sm:p-6 border-b border-[#E2E8F0] bg-gradient-to-r from-[rgba(97,95,255,0.1)] to-[rgba(173,70,255,0.1)]">
                <div className="flex items-center gap-3">
                  <Package
                    className="w-6 h-6 sm:w-7 sm:h-7 text-[#4F39F6]"
                    strokeWidth={2.33}
                  />
                  <h2 className="text-[#4F39F6] font-bold text-xl sm:text-2xl leading-8">
                    Quick Start Guide
                  </h2>
                </div>
                <p className="text-text-muted text-xs sm:text-sm leading-5">
                  Get ClaudeKit CLI running in 3 easy steps
                </p>
              </div>

              <div className="flex flex-col gap-6 p-4 sm:p-8">
                {/* Step 1 */}
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="flex w-10 h-10 items-center justify-center rounded-full border-2 border-[rgba(97,95,255,0.5)] bg-[rgba(97,95,255,0.2)] flex-shrink-0">
                    <span className="text-[#4F39F6] font-bold text-lg leading-7">
                      1
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 flex-1 w-full">
                    <h3 className="text-[#4F39F6] font-bold text-base sm:text-lg leading-7">
                      Install ClaudeKit CLI
                    </h3>
                    <p className="text-text-secondary text-sm leading-5">
                      Install the ClaudeKit CLI tool globally:
                    </p>
                    <div className="flex flex-col p-4 sm:p-5 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] font-mono overflow-x-auto">
                      <div className="flex gap-2">
                        <span className="text-green-primary text-sm">$</span>
                        <div className="flex flex-col gap-1 flex-1 text-xs sm:text-sm">
                          <div className="text-[#314158]">
                            npm install -g claudekit-cli
                          </div>
                          <div className="text-text-muted"># or with bun</div>
                          <div className="text-[#314158]">
                            bun add -g claudekit-cli
                          </div>
                          <div className="text-text-muted pt-2">
                            # Verify installation
                          </div>
                          <div className="text-[#314158]">ck --version</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="flex w-10 h-10 items-center justify-center rounded-full border-2 border-[rgba(173,70,255,0.5)] bg-[rgba(173,70,255,0.2)] flex-shrink-0">
                    <span className="text-[#9810FA] font-bold text-lg leading-7">
                      2
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 flex-1 w-full">
                    <h3 className="text-[#9810FA] font-bold text-base sm:text-lg leading-7">
                      Initialize ClaudeKit in Your Project
                    </h3>
                    <p className="text-text-secondary text-sm leading-5">
                      Navigate to your project and set up ClaudeKit:
                    </p>
                    <div className="flex flex-col p-4 sm:p-5 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] font-mono overflow-x-auto">
                      <div className="flex gap-2">
                        <span className="text-green-primary text-sm">$</span>
                        <div className="flex flex-col gap-1 flex-1 text-xs sm:text-sm">
                          <div className="text-[#314158]">
                            cd ~/projects/my-project
                          </div>
                          <div className="text-[#314158]">ck init</div>
                          <div className="text-text-muted">
                            # Interactive mode - follow the prompts
                          </div>
                          <div className="text-text-muted">
                            # This creates .claude/ directory with ClaudeKit
                            files
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 p-3 sm:p-4 rounded border border-[rgba(43,127,255,0.2)] bg-[rgba(43,127,255,0.1)]">
                      <p className="text-blue-primary font-medium text-xs">
                        💡 Choose Your Setup:
                      </p>
                      <div className="text-text-secondary text-xs leading-4">
                        <p>
                          When running{" "}
                          <code className="px-1 py-0.5 rounded bg-blue-light text-blue-primary font-mono text-xs">
                            ck init
                          </code>
                          , you'll see two options:
                        </p>
                        <ul className="ml-4 mt-1 space-y-1 list-disc">
                          <li>
                            <strong>Global (Recommended):</strong> Installs for
                            your user account. Works everywhere.
                          </li>
                          <li>
                            <strong>Local:</strong> Installs just for this
                            specific project folder.
                          </li>
                        </ul>
                        <p className="mt-2">
                          Choosing "Global" is usually easiest!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="flex w-10 h-10 items-center justify-center rounded-full border-2 border-[rgba(0,188,125,0.5)] bg-[rgba(0,188,125,0.2)] flex-shrink-0">
                    <span className="text-green-primary font-bold text-lg leading-7">
                      3
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 flex-1 w-full">
                    <h3 className="text-green-primary font-bold text-base sm:text-lg leading-7">
                      Start Claude Code & Create!
                    </h3>
                    <p className="text-text-secondary text-sm leading-5">
                      Launch Claude Code CLI and chat with AI:
                    </p>
                    <div className="flex flex-col gap-2 p-4 sm:p-5 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] font-mono overflow-x-auto">
                      <div className="flex gap-2">
                        <span className="text-green-primary text-sm">$</span>
                        <div className="flex flex-col gap-1 flex-1 text-xs sm:text-sm">
                          <div className="text-[#314158]">claude</div>
                          <div className="text-text-muted">
                            # Starts interactive Claude Code CLI
                          </div>
                        </div>
                      </div>
                      <div className="text-[#0092B8] text-xs ml-4">
                        Starting Claude Code CLI...
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 ml-4">
                        <span className="text-green-primary text-sm">You:</span>
                        <span className="text-[#314158] text-xs sm:text-sm">
                          Using ui-ux-pro-max skill, create a landing page for
                          my coffee shop
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 sm:p-4 rounded border border-[rgba(0,188,125,0.2)] bg-[rgba(0,188,125,0.1)]">
                      <Star className="w-4 h-4 text-green-primary flex-shrink-0" />
                      <p className="text-green-primary text-xs">
                        That's it! AI will search design databases and create
                        beautiful code for you.
                      </p>
                    </div>
                  </div>
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
        </main>
      </div>
      <Footer />
    </div>
  );
}
