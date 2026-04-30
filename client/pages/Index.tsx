import React from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { LeaderboardSection } from "@/components/LeaderboardSection";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />

      <div className="lg:ml-64 pt-28 pb-12 min-w-0">
        <main className="px-4 sm:px-6 lg:px-12 min-w-0">
          <div className="flex flex-col gap-6 sm:gap-8 min-w-0">
            {/* Project Description */}
            <div className="rounded-2xl border border-amber-200/50 bg-gradient-to-br from-white to-amber-50/40 p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                eebPAIBench: Unified Image-to-Code Benchmarking Platform
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                eebPAIBench is a tool-oriented platform that unifies multiple research methods for the
                Image-to-Code task - automatically generating HTML + CSS from webpage screenshots.
                It integrates generation methods such as <strong>DCGen</strong> (divide-and-conquer),
                <strong> Direct</strong> (single-pass), and others under a common evaluation framework,
                enabling reproducible comparison across models and techniques on standardized datasets.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100 min-w-0">
                  <span className="font-bold text-amber-700 text-base leading-none mt-0.5 shrink-0">10+</span>
                  <span className="text-gray-600 min-w-0">Model families supported (GPT-4o, Claude, Gemini, Qwen, DeepSeek, and more)</span>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100 min-w-0">
                  <span className="font-bold text-amber-700 text-base leading-none mt-0.5 shrink-0">7</span>
                  <span className="text-gray-600 min-w-0">Evaluation metrics (CLIP, Code Similarity, Block Match, Text, Position, Color, FG-CLIP)</span>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100 min-w-0">
                  <span className="font-bold text-amber-700 text-base leading-none mt-0.5 shrink-0">2</span>
                  <span className="text-gray-600 min-w-0">Benchmark datasets (DCGen with 461 samples, Design2Code with 484 webpages)</span>
                </div>
              </div>
            </div>

            {/* Leaderboard with dataset switcher */}
            <LeaderboardSection categories={["dcgen", "design2code"]} />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

