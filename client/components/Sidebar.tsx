import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  
  const navItems = [
    {
      path: "/dcgen",
      name: "DCGen",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 8H8V12H12V8Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.49999 15C7.32499 15 7.99998 14.325 7.99998 13.5V12H6.49999C5.67499 12 5 12.675 5 13.5C5 14.325 5.67499 15 6.49999 15Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.49999 8.00001H7.99998V6.49999C7.99998 5.67499 7.32499 5 6.49999 5C5.67499 5 5 5.67499 5 6.49999C5 7.32499 5.67499 8.00001 6.49999 8.00001Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 8.00001H13.5C14.325 8.00001 15 7.32499 15 6.49999C15 5.67499 14.325 5 13.5 5C12.675 5 12 5.67499 12 6.49999V8.00001Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.5 15C14.325 15 15 14.325 15 13.5C15 12.675 14.325 12 13.5 12H12V13.5C12 14.325 12.675 15 13.5 15Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.49996 18.3333H12.5C16.6666 18.3333 18.3333 16.6667 18.3333 12.5V7.5C18.3333 3.33333 16.6666 1.66667 12.5 1.66667H7.49996C3.33329 1.66667 1.66663 3.33333 1.66663 7.5V12.5C1.66663 16.6667 3.33329 18.3333 7.49996 18.3333Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {path: "/design2code",
      
      name: "Design2Code",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.08329 15.8083H6.66663C3.33329 15.8083 1.66663 14.975 1.66663 10.8083V6.64164C1.66663 3.30831 3.33329 1.64164 6.66663 1.64164H13.3333C16.6666 1.64164 18.3333 3.30831 18.3333 6.64164V10.8083C18.3333 14.1416 16.6666 15.8083 13.3333 15.8083H12.9166C12.6583 15.8083 12.4083 15.9333 12.25 16.1417L11 17.8083C10.45 18.5417 9.54995 18.5417 8.99995 17.8083L7.74995 16.1417C7.61662 15.9583 7.31663 15.8083 7.08329 15.8083Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.66667 7.25001L5 8.91667L6.66667 10.5833"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.3334 7.25001L15 8.91667L13.3334 10.5833"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.8333 6.975L9.16663 10.8584"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  const aboutLinks = [
    {
      name: "Live Demo",
      path: "/live-demo",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.33331 6.66667V13.3333L13.3333 10L8.33331 6.66667Z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      name: "Citations",
      path: "/citations",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.33329 5.83333V14.1667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11.6667 5.83333V14.1667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7.49996 18.3333H12.5C16.6666 18.3333 18.3333 16.6667 18.3333 12.5V7.5C18.3333 3.33333 16.6666 1.66667 12.5 1.66667H7.49996C3.33329 1.66667 1.66663 3.33333 1.66663 7.5V12.5C1.66663 16.6667 3.33329 18.3333 7.49996 18.3333Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      name: "Submit",
      path: "/submit",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.50004 18.3333H12.5C16.6667 18.3333 18.3334 16.6667 18.3334 12.5V7.5C18.3334 3.33333 16.6667 1.66667 12.5 1.66667H7.50004C3.33337 1.66667 1.66671 3.33333 1.66671 7.5V12.5C1.66671 16.6667 3.33337 18.3333 7.50004 18.3333Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 6.66667V13.3333" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.66663 10H13.3333" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 z-40 bg-dark-bg border-r border-dark-border hidden lg:block">
      <div className="flex flex-col h-full py-6">
        {/* Brand section */}
        <div className="px-6 mb-6">
          <a href="/" className="flex items-center">
            <div className="flex flex-col">
              <span className="text-amber-primary font-display font-bold text-lg">WebBench</span>
              <span className="text-dark-muted text-xs">Design-to-code benchmarking</span>
            </div>
          </a>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 px-4 overflow-y-auto">
          {/* Leaderboard Section */}
          <div className="mb-6">
            <div className="text-dark-muted font-semibold text-xs uppercase tracking-wider px-2 mb-3">
              Leaderboard
            </div>
            <nav className="flex flex-col gap-1">
              <Link
                to="/"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  location.pathname === "/"
                    ? "bg-amber-primary/10 text-amber-primary"
                    : "text-dark-text/70 hover:text-amber-primary hover:bg-dark-surface"
                }`}
              >
                <div className={location.pathname === "/" ? "text-amber-primary" : "text-current"}>
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 15V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 15V5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 15V12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7.49996 18.3333H12.5C16.6666 18.3333 18.3333 16.6667 18.3333 12.5V7.5C18.3333 3.33333 16.6666 1.66667 12.5 1.66667H7.49996C3.33329 1.66667 1.66663 3.33333 1.66663 7.5V12.5C1.66663 16.6667 3.33329 18.3333 7.49996 18.3333Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="font-medium text-sm">Leaderboard</span>
                {location.pathname === "/" && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-primary shadow-[0_0_8px_0_rgba(251,191,36,0.6)]" />
                )}
              </Link>
            </nav>
          </div>

          <div className="text-dark-muted font-semibold text-xs uppercase tracking-wider px-2 mb-3">
            Benchmarks
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? "bg-amber-primary/10 text-amber-primary"
                      : "text-dark-text/70 hover:text-amber-primary hover:bg-dark-surface"
                  }`}
                >
                  <div className={isActive ? "text-amber-primary" : "text-current"}>
                    {item.icon}
                  </div>
                  <span className="font-medium text-sm">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-primary shadow-[0_0_8px_0_rgba(251,191,36,0.6)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* About Section */}
          <div className="mt-6 mb-6">
            <h3 className="text-dark-muted font-semibold text-xs uppercase tracking-wider px-2 mb-3">
              About
            </h3>
            <nav className="space-y-1">
              {aboutLinks.map((link, index) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={index}
                    to={link.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? "bg-amber-primary/10 text-amber-primary"
                        : "text-dark-text/70 hover:text-amber-primary hover:bg-dark-surface"
                    }`}
                  >
                    <div className={isActive ? "text-amber-primary" : "text-current"}>
                      {link.icon}
                    </div>
                    <span className="font-medium text-sm">{link.name}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-primary shadow-[0_0_8px_0_rgba(251,191,36,0.6)]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 pt-4 border-t border-dark-border">
          <div className="text-dark-muted text-xs">
            © 2025 WebBench
          </div>
        </div>
      </div>
    </aside>
  );
}


