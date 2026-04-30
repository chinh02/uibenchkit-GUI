export default function Footer() {
  return (
    <footer className="flex flex-col items-start self-stretch border-t border-amber-200/50 bg-card backdrop-blur-xl px-4 sm:px-8 lg:px-20 ml-64">
      <div className="flex flex-col items-start gap-8 self-stretch max-w-[1280px] px-4 sm:px-8 py-8 sm:py-12 mx-auto w-full">
        <div className="flex flex-col lg:flex-row justify-center items-start gap-8 self-stretch flex-wrap">
          {/* Brand Section */}
          <div className="flex flex-col items-start gap-4 w-full lg:w-[280px]">
            <div className="flex items-center gap-3 self-stretch">
              <div className="w-12 h-12 bg-amber-primary rounded-lg flex items-center justify-center">
                <span className="text-dark-bg font-bold text-xl">W</span>
              </div>
              <div className="flex flex-col justify-center">
                <div className="pb-1">
                  <div className="font-display text-xl font-bold leading-5 text-text-primary">
                    WebBench
                  </div>
                </div>
                <div className="text-text-muted font-medium text-xs leading-4 tracking-[0.3px]">
                  Unified design-to-code benchmark platform
                </div>
              </div>
            </div>
            <div className="self-stretch text-text-secondary text-sm leading-5">
              Comprehensive benchmarks for evaluating AI-driven webpage code
              generation from visual designs.
            </div>
          </div>

          {/* Benchmarks Section */}
          <div className="flex flex-col items-start gap-4 w-full sm:w-auto lg:w-[280px]">
            <h4 className="self-stretch text-text-primary font-display text-base font-light leading-6">
              Benchmarks
            </h4>
            <div className="flex flex-col gap-2 self-stretch">
              <a
                href="/dcgen"
                className="text-text-secondary text-sm leading-5 hover:text-amber-600 transition-colors"
              >
                DCGen
              </a>
              <a
                href="/design2code"
                className="text-text-secondary text-sm leading-5 hover:text-amber-600 transition-colors"
              >
                Design2Code
              </a>
            </div>
          </div>

          {/* Resources Section */}
          <div className="flex flex-col items-start gap-4 w-full sm:w-auto lg:w-[280px]">
            <h4 className="self-stretch text-text-primary font-display text-base font-light leading-6">
              Resources
            </h4>
            <div className="flex flex-col gap-2 self-stretch">
              <a
                href="/live-demo"
                className="text-text-secondary text-sm leading-5 hover:text-amber-600 transition-colors"
              >
                Live Demo
              </a>
              <a
                href="https://github.com/WebPAI/DCGen"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary text-sm leading-5 hover:text-amber-600 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col items-start gap-4 w-full sm:w-auto lg:w-[280px]">
            <h4 className="text-text-primary font-display text-base font-light leading-6">
              Contact
            </h4>
            <div className="flex flex-col gap-2 self-stretch">
              <a
                href="/citations"
                className="text-text-secondary text-sm leading-5 hover:text-amber-600 transition-colors"
              >
                How to Cite
              </a>
              <a
                href="/submit"
                className="text-text-secondary text-sm leading-5 hover:text-amber-600 transition-colors"
              >
                Submit Results
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col items-center self-stretch pt-8 border-t border-amber-200/50">
          <p className="text-text-muted text-center text-sm leading-5">
            (c) 2025 WebBench. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

