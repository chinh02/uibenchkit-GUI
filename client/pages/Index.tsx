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
} from "lucide-react";

export default function Index() {
  const leaderboardData = [
    {
      rank: 1,
      model: "Qwen2.5-vl-3B-instruct (Mark)",
      clip: "59.44%",
      ssim: "42.82%",
      text: "43.19%",
      position: "51.49%",
      ir: "79.68%",
      overall: "57.42%",
    },
    {
      rank: 2,
      model: "Claude-3.5-Sonnet (Direct)",
      clip: "56.74%",
      ssim: "42.09%",
      text: "38.33%",
      position: "51.23%",
      ir: "79.14%",
      overall: "57.42%",
    },
    {
      rank: 3,
      model: "GPT-4o (Mark)",
      clip: "59.55%",
      ssim: "44.88%",
      text: "44.74%",
      position: "52.25%",
      ir: "81.28%",
      overall: "55.98%",
    },
    {
      rank: 4,
      model: "Claude-3.5-Sonnet (CoT)",
      clip: "56.06%",
      ssim: "40.05%",
      text: "36.62%",
      position: "50.85%",
      ir: "77.27%",
      overall: "57.42%",
    },
    {
      rank: 5,
      model: "GPT-4o (Direct)",
      clip: "56.05%",
      ssim: "41.49%",
      text: "35.90%",
      position: "48.88%",
      ir: "77.54%",
      overall: "55.98%",
    },
    {
      rank: 6,
      model: "GPT-4o (CoT)",
      clip: "52.34%",
      ssim: "40.13%",
      text: "36.63%",
      position: "46.68%",
      ir: "72.73%",
      overall: "55.98%",
    },
    {
      rank: 7,
      model: "Gemini-1.5-flash (Mark)",
      clip: "51.94%",
      ssim: "38.98%",
      text: "34.54%",
      position: "46.12%",
      ir: "73.26%",
      overall: "50.08%",
    },
    {
      rank: 8,
      model: "Gemini-1.5-flash (CoT)",
      clip: "50.93%",
      ssim: "38.54%",
      text: "32.17%",
      position: "45.11%",
      ir: "71.12%",
      overall: "50.08%",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#F8FAFC]">
      <Header />

      <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 max-w-[1200px] mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-12">
        {/* Sidebar - Hidden on mobile, visible on large screens */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <main className="flex-1 w-full pt-6">
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
                    className="text-blue-primary underline hover:no-underline"
                  >
                    Paper
                  </a>
                </p>
              </div>
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

            {/* Quick Start Guide */}
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

            {/* Official Leaderboard */}
            <div
              className="flex flex-col rounded-2xl border border-[#E2E8F0] bg-white/80 shadow-sm"
              id="leaderboard"
            >
              <div className="flex flex-col gap-2 p-4 sm:p-6 border-b border-[#E2E8F0] bg-gradient-to-r from-[rgba(0,184,219,0.1)] to-[rgba(43,127,255,0.1)]">
                <div className="flex items-center gap-3">
                  <Code
                    className="w-6 h-6 sm:w-7 sm:h-7 text-[#0092B8]"
                    strokeWidth={2.33}
                  />
                  <h2 className="text-[#0092B8] font-bold text-xl sm:text-2xl leading-8">
                    Official Leaderboard
                  </h2>
                </div>
                <p className="text-text-muted text-xs sm:text-sm leading-5">
                  Here's exactly the Leaderboard
                </p>

                <div className="flex items-center gap-3 mt-4 flex-wrap">
                  <button className="px-3 sm:px-4 py-2 rounded-xl border border-blue-secondary bg-[#0092B8] text-white font-semibold text-xs sm:text-sm whitespace-nowrap">
                    Interaction2Code
                  </button>
                  <button className="px-3 sm:px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-text-primary font-medium text-xs sm:text-sm hover:border-blue-primary transition-colors whitespace-nowrap">
                    MRWeb
                  </button>
                  <button className="px-3 sm:px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-text-primary font-medium text-xs sm:text-sm hover:border-blue-primary transition-colors whitespace-nowrap">
                    DCGen
                  </button>
                  <button className="px-3 sm:px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-text-primary font-medium text-xs sm:text-sm hover:border-blue-primary transition-colors whitespace-nowrap">
                    Design2Code
                  </button>
                  <button className="px-3 sm:px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-text-primary font-medium text-xs sm:text-sm hover:border-blue-primary transition-colors whitespace-nowrap">
                    DesignBench
                  </button>
                </div>
              </div>

              {/* Leaderboard Table - Scrollable on mobile */}
              <div className="p-2 sm:p-4 overflow-x-auto">
                <div className="rounded-lg bg-white overflow-hidden min-w-[800px]">
                  <div className="flex items-center justify-between px-4 py-2.5 rounded-md bg-[#0092B8] text-white">
                    <div className="w-20 sm:w-28 font-bold text-xs sm:text-sm">
                      Rank
                    </div>
                    <div className="w-48 sm:w-60 font-semibold text-xs sm:text-sm">
                      Model
                    </div>
                    <div className="w-20 sm:w-24 font-semibold text-xs sm:text-sm">
                      Clip
                    </div>
                    <div className="w-20 sm:w-24 font-semibold text-xs sm:text-sm">
                      SSIM
                    </div>
                    <div className="w-20 sm:w-24 font-semibold text-xs sm:text-sm">
                      Text
                    </div>
                    <div className="w-20 sm:w-24 font-semibold text-xs sm:text-sm">
                      Position
                    </div>
                    <div className="w-20 sm:w-28 font-semibold text-xs sm:text-sm">
                      IR
                    </div>
                    <div className="w-20 sm:w-24 font-semibold text-xs sm:text-sm">
                      Overall
                    </div>
                  </div>
                  {leaderboardData.map((row, index) => (
                    <div key={index}>
                      <div
                        className={`flex items-center justify-between px-4 py-3 sm:py-4 ${index % 2 === 0 ? "bg-bg-soft" : ""}`}
                      >
                        <div className="w-20 sm:w-28 text-[#363636] font-medium text-xs sm:text-sm">
                          #{row.rank}
                        </div>
                        <div className="w-48 sm:w-60 text-[#363636] font-medium text-xs sm:text-sm truncate">
                          {row.model}
                        </div>
                        <div className="w-20 sm:w-24 text-[#363636] font-medium text-xs sm:text-sm">
                          {row.clip}
                        </div>
                        <div className="w-20 sm:w-24 text-[#363636] font-medium text-xs sm:text-sm">
                          {row.ssim}
                        </div>
                        <div className="w-20 sm:w-24 text-[#363636] font-medium text-xs sm:text-sm">
                          {row.text}
                        </div>
                        <div className="w-20 sm:w-24 text-[#363636] font-medium text-xs sm:text-sm">
                          {row.position}
                        </div>
                        <div className="w-20 sm:w-28 text-[#363636] font-medium text-xs sm:text-sm">
                          {row.ir}
                        </div>
                        <div className="w-20 sm:w-24 text-blue-primary font-semibold text-xs sm:text-sm">
                          {row.overall}
                        </div>
                      </div>
                      {index < leaderboardData.length - 1 && (
                        <div className="h-px bg-[#E7E7E7]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CCS - Claude Code Switch */}
            <div className="flex flex-col rounded-xl border border-[#FEE685] bg-white/80 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 bg-gradient-to-r from-[rgba(254,154,0,0.1)] to-[rgba(255,105,0,0.1)]">
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                    <div className="px-3 py-1 rounded-full border border-[rgba(254,154,0,0.4)] bg-[rgba(254,154,0,0.2)]">
                      <span className="text-[#BB4D00] font-bold text-xs leading-4">
                        POWER TOOL
                      </span>
                    </div>
                    <h2 className="text-[#E17100] font-bold text-lg sm:text-xl leading-7">
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
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-[#FEE685] bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] hover:shadow-lg transition-shadow whitespace-nowrap"
                >
                  <span className="text-[#E17100] font-bold text-sm sm:text-base leading-6">
                    View CCS Guide
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#E17100]" />
                </a>
              </div>
            </div>

            {/* Pro Tips for CLI Power Users */}
            <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-8 rounded-2xl border border-[#E2E8F0] bg-white/80 shadow-sm">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex p-2 sm:p-3 rounded-xl bg-[#DBEAFE]">
                  <Lightbulb
                    className="w-5 h-5 sm:w-6 sm:h-6 text-blue-primary"
                    strokeWidth={2}
                  />
                </div>
                <h2 className="text-text-primary font-semibold text-base sm:text-lg leading-7">
                  Pro Tips for CLI Power Users
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg border border-[#E2E8F0] bg-bg-soft">
                  <Code
                    className="w-5 h-5 sm:w-6 sm:h-6 text-green-teal flex-shrink-0 mt-0.5"
                    strokeWidth={2}
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[#1D293D] font-medium text-sm">
                      Use Quotes for Multi-word Requests
                    </h3>
                    <p className="text-text-secondary text-xs leading-4">
                      Always wrap your requests in double quotes: "your request
                      here"
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg border border-[#E2E8F0] bg-bg-soft">
                  <MessageSquare
                    className="w-5 h-5 sm:w-6 sm:h-6 text-blue-cyan flex-shrink-0 mt-0.5"
                    strokeWidth={2}
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[#1D293D] font-medium text-sm">
                      Interactive Mode = Better Iteration
                    </h3>
                    <p className="text-text-secondary text-xs leading-4">
                      Use{" "}
                      <code className="px-1 py-0.5 rounded bg-[#ECFEFF] text-[#0092B8] font-mono text-xs">
                        ccs
                      </code>{" "}
                      without arguments for back-and-forth refinement
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg border border-[#E2E8F0] bg-bg-soft">
                  <FileText
                    className="w-5 h-5 sm:w-6 sm:h-6 text-[#2B7FFF] flex-shrink-0 mt-0.5"
                    strokeWidth={2}
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[#1D293D] font-medium text-sm">
                      Reference Files with @
                    </h3>
                    <p className="text-text-secondary text-xs leading-4">
                      Use{" "}
                      <code className="px-1 py-0.5 rounded bg-blue-light text-blue-primary font-mono text-xs">
                        @filename
                      </code>{" "}
                      to tell AI which files to modify
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg border border-[#E2E8F0] bg-bg-soft">
                  <Star
                    className="w-5 h-5 sm:w-6 sm:h-6 text-purple-primary flex-shrink-0 mt-0.5"
                    strokeWidth={2}
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[#1D293D] font-medium text-sm">
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
