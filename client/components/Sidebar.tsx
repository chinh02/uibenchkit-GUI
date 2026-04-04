import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  
  const navItems = [
    {
      name: "Interaction2Code",
      path: "/interaction2code",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.16663 7.5V13.3333"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.37496 7.08333C5.87073 7.08333 7.08329 5.87077 7.08329 4.375C7.08329 2.87923 5.87073 1.66667 4.37496 1.66667C2.87919 1.66667 1.66663 2.87923 1.66663 4.375C1.66663 5.87077 2.87919 7.08333 4.37496 7.08333Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.16663 18.3333C5.54734 18.3333 6.66663 17.214 6.66663 15.8333C6.66663 14.4526 5.54734 13.3333 4.16663 13.3333C2.78591 13.3333 1.66663 14.4526 1.66663 15.8333C1.66663 17.214 2.78591 18.3333 4.16663 18.3333Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.8334 18.3333C17.2141 18.3333 18.3334 17.214 18.3334 15.8333C18.3334 14.4526 17.2141 13.3333 15.8334 13.3333C14.4527 13.3333 13.3334 14.4526 13.3334 15.8333C13.3334 17.214 14.4527 18.3333 15.8334 18.3333Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.27502 7.5C4.65002 8.95833 5.98336 10.0417 7.55836 10.0333L10.4167 10.025C12.6 10.0167 14.4584 11.4167 15.1417 13.3667"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      name: "MRWeb",
      path: "/mrweb",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.3333 10.8333V7.5C18.3333 3.33333 16.6666 1.66667 12.5 1.66667H7.49996C3.33329 1.66667 1.66663 3.33333 1.66663 7.5V12.5C1.66663 16.6667 3.33329 18.3333 7.49996 18.3333H12.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.8333 18.3333V13.3333L14.1666 15"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.8334 13.3333L17.5 15"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.29163 5.21667L7.41663 13.1083"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.925 5.21667L10.05 13.1083"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.44165 7.85H13.3333"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 10.4833H12.8917"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
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
    {path: "/designbench",
      
      name: "DesignBench",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.49996 18.3333H12.5C16.6666 18.3333 18.3333 16.6667 18.3333 12.5V7.5C18.3333 3.33334 16.6666 1.66667 12.5 1.66667H7.49996C3.33329 1.66667 1.66663 3.33334 1.66663 7.5V12.5C1.66663 16.6667 3.33329 18.3333 7.49996 18.3333Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.00002 7.47501L5.92502 9.55001C5.68336 9.79167 5.68336 10.2 5.92502 10.4417L8.00002 12.5167"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 7.47501L14.075 9.55001C14.3167 9.79167 14.3167 10.2 14.075 10.4417L12 12.5167"
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
      name: "Paper",
      path: "/paper",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.6667 1.66667H5.00004C4.55801 1.66667 4.13409 1.84226 3.82153 2.15482C3.50897 2.46738 3.33337 2.89131 3.33337 3.33334V16.6667C3.33337 17.1087 3.50897 17.5326 3.82153 17.8452C4.13409 18.1577 4.55801 18.3333 5.00004 18.3333H15C15.442 18.3333 15.866 18.1577 16.1785 17.8452C16.4911 17.5326 16.6667 17.1087 16.6667 16.6667V6.66667L11.6667 1.66667Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11.6667 1.66667V6.66667H16.6667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.3334 10.8333H6.66671" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.3334 14.1667H6.66671" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.33337 7.5H7.50004H6.66671" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      name: "Docs", 
      path: "/docs",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.83337 18.3333H14.1667C16.6667 18.3333 18.3334 16.6667 18.3334 14.1667V5.83333C18.3334 3.33333 16.6667 1.66667 14.1667 1.66667H5.83337C3.33337 1.66667 1.66671 3.33333 1.66671 5.83333V14.1667C1.66671 16.6667 3.33337 18.3333 5.83337 18.3333Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.66671 7.08333H13.3334" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.66671 10.4167H13.3334" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.66671 13.75H10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      name: "Blog", 
      path: "/blog",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.1667 2.91667H5.83337C4.91671 2.91667 4.16671 3.66667 4.16671 4.58333V17.0833C4.16671 17.7083 4.55837 18.0833 5.15004 17.9167L9.63337 16.6C9.85004 16.5333 10.15 16.5333 10.3584 16.6L14.8417 17.9167C15.4334 18.0833 15.825 17.7 15.825 17.0833V4.58333C15.8334 3.66667 15.0834 2.91667 14.1667 2.91667Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.33337 7.5H11.6667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      name: "Contact", 
      path: "/contact",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.1666 17.0833H5.83329C3.33329 17.0833 1.66663 15.8333 1.66663 12.9167V7.08333C1.66663 4.16667 3.33329 2.91667 5.83329 2.91667H14.1666C16.6666 2.91667 18.3333 4.16667 18.3333 7.08333V12.9167C18.3333 15.8333 16.6666 17.0833 14.1666 17.0833Z" stroke="currentColor" strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14.1667 7.5L11.5584 9.58333C10.7 10.2667 9.29171 10.2667 8.43337 9.58333L5.83337 7.5" stroke="currentColor" strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
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
      name: "Press", 
      path: "/press",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.49996 18.3333H12.5C16.6666 18.3333 18.3333 16.6667 18.3333 12.5V7.5C18.3333 3.33333 16.6666 1.66667 12.5 1.66667H7.49996C3.33329 1.66667 1.66663 3.33333 1.66663 7.5V12.5C1.66663 16.6667 3.33329 18.3333 7.49996 18.3333Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.66663 7.5H9.99996" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 10.8333H6.66663" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.3333 7.5V14.1667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
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
    <aside className="fixed left-0 top-0 h-screen w-64 z-40 bg-dark-bg border-r border-dark-border">
      <div className="flex flex-col h-full py-6">
        {/* Logo section */}
        <div className="px-6 mb-6">
          <a href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
              <img src="/logo.jpeg" alt="WebPAIBench Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-amber-primary font-display font-bold text-lg">WebPAIBench</span>
              <span className="text-dark-muted text-xs">Web AI Benchmarks</span>
            </div>
          </a>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 px-4 overflow-y-auto">
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
            © 2025 WebPAIBench
          </div>
        </div>
      </div>
    </aside>
  );
}
