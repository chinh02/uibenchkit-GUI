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
                    WebPAIBench
                  </div>
                </div>
                <div className="text-text-muted font-medium text-xs leading-4 tracking-[0.3px]">
                  Crystal clear AI coding
                </div>
              </div>
            </div>
            <div className="self-stretch text-text-secondary text-sm leading-5">
              Build anything without terminal friction. Powered by ClaudeKit
              Framework.
            </div>
          </div>

          {/* Product Section */}
          <div className="flex flex-col items-start gap-4 w-full sm:w-auto lg:w-[280px]">
            <h4 className="self-stretch text-text-primary font-display text-base font-light leading-6">
              Product
            </h4>
            <div className="flex flex-col gap-2 self-stretch">
              <a
                href="#features"
                className="text-text-secondary text-sm leading-5 hover:text-amber-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-text-secondary text-sm leading-5 hover:text-amber-600 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#waitlist"
                className="text-text-secondary text-sm leading-5 hover:text-amber-600 transition-colors"
              >
                Waitlist
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
                href="#guides"
                className="text-text-secondary text-sm leading-5 hover:text-amber-600 transition-colors"
              >
                Guides
              </a>
              <a
                href="#documentation"
                className="text-text-secondary text-sm leading-5 hover:text-amber-600 transition-colors"
              >
                Documentation
              </a>
              <a
                href="#discord"
                className="text-text-secondary text-sm leading-5 hover:text-amber-600 transition-colors"
              >
                ClaudeKit Discord
              </a>
            </div>
          </div>

          {/* Get Started Section */}
          <div className="flex flex-col items-start gap-4 w-full sm:w-auto lg:w-[280px]">
            <h4 className="text-text-primary font-display text-base font-light leading-6">
              Get Started
            </h4>
            <a
              href="#claudekit"
              className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_10px_15px_-3px_rgba(251,191,36,0.3),0_4px_6px_-4px_rgba(251,191,36,0.3)] hover:shadow-xl transition-shadow"
            >
              <span className="text-dark-bg font-medium text-sm leading-5">
                ClaudeKit (20% OFF)
              </span>
            </a>
            <p className="text-text-muted text-xs leading-4">
              Required for VividKit
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col items-center self-stretch pt-8 border-t border-amber-200/50">
          <p className="text-text-muted text-center text-sm leading-5">
            © 2025 WebPAIBench. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
