import { Moon, Menu } from "lucide-react";

export default function Header() {
  return (
    <div className="fixed top-4 sm:top-6 left-64 right-0 z-50 flex justify-center px-4">
      <div className="w-full max-w-[1024px] flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-amber-200/40 bg-amber-50/90 shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_25px_50px_-12px_rgba(0,0,0,0.1)] backdrop-blur-xl">
        <div className="flex items-center justify-between flex-1 gap-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-9 sm:w-12 sm:h-11 bg-amber-primary rounded-lg flex items-center justify-center">
              <span className="text-dark-bg font-bold text-lg sm:text-xl">W</span>
            </div>
            <div className="hidden sm:flex flex-col justify-center">
              <div className="pb-1">
                <div className="font-display text-lg sm:text-xl font-bold leading-5 text-text-primary">
                  WebPAIBench
                </div>
              </div>
              <div className="text-text-muted font-medium text-xs leading-4 tracking-[0.3px]">
                Web AI Bench
              </div>
            </div>
          </a>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center justify-center">
            <div className="flex items-center gap-5 px-4 py-1.5 rounded-full border border-amber-200/30 bg-white/60 shadow-[0_2px_4px_1px_rgba(0,0,0,0.03)_inset]">
              <a
                href="#leaderboard"
                className="px-2 py-1 rounded-full border border-transparent"
              >
                <span className="text-text-secondary font-medium text-sm leading-5 uppercase">
                  LEADERBOARD
                </span>
              </a>
              <a
                href="#"
                className="px-2 py-1 rounded-full border border-amber-300 bg-amber-50 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-2px_rgba(0,0,0,0.05)]"
              >
                <span className="text-amber-700 font-semibold text-xs leading-4 tracking-[0.3px] uppercase">
                  WebPAIBench
                </span>
              </a>
              <a
                href="#about"
                className="px-2 py-1 rounded-full border border-transparent"
              >
                <span className="text-text-secondary font-medium text-sm uppercase">
                  About
                </span>
              </a>
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="hidden sm:flex w-8 h-8 items-center justify-center rounded-full hover:bg-amber-100 transition-colors">
              <Moon className="w-4 h-4 text-text-secondary" />
            </button>
            <a
              href="#paper"
              className="hidden md:flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_10px_15px_-3px_rgba(251,191,36,0.3),0_4px_6px_-4px_rgba(251,191,36,0.3)]"
            >
              <span className="text-dark-bg font-bold text-xs leading-4 whitespace-nowrap">
                More in the paper !
              </span>
              <svg
                className="w-3 h-3"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2.5 6H9.5" stroke="#1C1917" />
                <path d="M6 2.5L9.5 6L6 9.5" stroke="#1C1917" />
              </svg>
            </a>
            {/* Mobile menu button - visible on small screens */}
            <button className="lg:hidden flex items-center justify-center w-8 h-8 rounded-full hover:bg-amber-100 transition-colors">
              <Menu className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
