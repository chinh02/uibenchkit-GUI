import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { LeaderboardSection } from "@/components/LeaderboardSection";
import { Lightbulb } from "lucide-react";

export default function Design2Code() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <div className="lg:ml-64 pt-28 pb-12 min-w-0">
        <main className="flex justify-center min-w-0">
          <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-12 min-w-0">
            <div className="flex flex-col gap-6 sm:gap-8 min-w-0">
              {/* Introduction */}
              <div className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-6 rounded-xl border border-[#E9D4FF] bg-white/70">
                <div className="flex w-10 h-10 items-center justify-center rounded-full bg-blue-light shrink-0">
                  <Lightbulb className="w-5 h-5 text-blue-primary" strokeWidth={1.67} />
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
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

              {/* Design2Code-only leaderboard */}
              <LeaderboardSection
                categories={["design2code"]}
                title="Design2Code Leaderboard"
              />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
