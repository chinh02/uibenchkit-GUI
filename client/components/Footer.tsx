export default function Footer() {
  return (
    <footer className="flex flex-col items-start self-stretch border-t border-[#E2E8F0] bg-white/80 backdrop-blur-xl px-20">
      <div className="flex flex-col items-start gap-8 self-stretch max-w-[1280px] px-8 py-12 mx-auto">
        <div className="flex justify-center items-start gap-8 self-stretch flex-wrap lg:flex-nowrap">
          {/* Brand Section */}
          <div className="flex flex-col items-start gap-4 w-full lg:w-[280px]">
            <div className="flex items-center gap-3 self-stretch">
              <img 
                src="https://api.builder.io/api/v1/image/assets/TEMP/b3de1fcfae5139ab1c4b12c75496d91e98e20b88?width=106" 
                alt="WebPAIBench" 
                className="w-[53px] h-12"
              />
              <div className="flex flex-col justify-center">
                <div className="pb-1">
                  <div className="font-display text-xl font-bold leading-5 bg-gradient-to-r from-[#155DFC] via-[#00A6F4] to-[#00B8DB] bg-clip-text text-transparent">
                    WebPAIBench
                  </div>
                </div>
                <div className="text-text-muted font-medium text-xs leading-4 tracking-[0.3px]">
                  Crystal clear AI coding
                </div>
              </div>
            </div>
            <div className="self-stretch text-text-secondary text-sm leading-5">
              Build anything without terminal friction. Powered by ClaudeKit Framework.
            </div>
          </div>

          {/* Product Section */}
          <div className="flex flex-col items-start gap-4 w-full lg:w-[280px]">
            <h4 className="self-stretch text-text-primary font-display text-base font-light leading-6">
              Product
            </h4>
            <div className="flex flex-col gap-2 self-stretch">
              <a href="#features" className="text-text-secondary text-sm leading-5 hover:text-blue-primary transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-text-secondary text-sm leading-5 hover:text-blue-primary transition-colors">
                Pricing
              </a>
              <a href="#waitlist" className="text-text-secondary text-sm leading-5 hover:text-blue-primary transition-colors">
                Waitlist
              </a>
            </div>
          </div>

          {/* Resources Section */}
          <div className="flex flex-col items-start gap-4 w-full lg:w-[280px]">
            <h4 className="self-stretch text-text-primary font-display text-base font-light leading-6">
              Resources
            </h4>
            <div className="flex flex-col gap-2 self-stretch">
              <a href="#guides" className="text-text-secondary text-sm leading-5 hover:text-blue-primary transition-colors">
                Guides
              </a>
              <a href="#documentation" className="text-text-secondary text-sm leading-5 hover:text-blue-primary transition-colors">
                Documentation
              </a>
              <a href="#discord" className="text-text-secondary text-sm leading-5 hover:text-blue-primary transition-colors">
                ClaudeKit Discord
              </a>
            </div>
          </div>

          {/* Get Started Section */}
          <div className="flex flex-col items-start gap-4 w-full lg:w-[280px]">
            <h4 className="text-text-primary font-display text-base font-light leading-6">
              Get Started
            </h4>
            <a 
              href="#claudekit" 
              className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] shadow-[0_10px_15px_-3px_rgba(43,127,255,0.2),0_4px_6px_-4px_rgba(43,127,255,0.2)]"
            >
              <span className="text-white font-medium text-sm leading-5">
                ClaudeKit (20% OFF)
              </span>
            </a>
            <p className="text-text-muted text-xs leading-4">
              Required for VividKit
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col items-center self-stretch pt-8 border-t border-[#E2E8F0]">
          <p className="text-text-muted text-center text-sm leading-5">
            © 2025 VividKit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
