import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { LeaderboardSection } from "@/components/LeaderboardSection";
import { Lightbulb } from "lucide-react";

export default function DCGen() {
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

              {/* DCGen-only leaderboard */}
              <LeaderboardSection
                categories={["dcgen"]}
                title="DCGen Leaderboard"
              />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
