export default function Sidebar() {
  const navItems = [
    {
      name: "Interaction2Code",
      active: true,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.16663 7.5V13.3333" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4.37496 7.08333C5.87073 7.08333 7.08329 5.87077 7.08329 4.375C7.08329 2.87923 5.87073 1.66667 4.37496 1.66667C2.87919 1.66667 1.66663 2.87923 1.66663 4.375C1.66663 5.87077 2.87919 7.08333 4.37496 7.08333Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4.16663 18.3333C5.54734 18.3333 6.66663 17.214 6.66663 15.8333C6.66663 14.4526 5.54734 13.3333 4.16663 13.3333C2.78591 13.3333 1.66663 14.4526 1.66663 15.8333C1.66663 17.214 2.78591 18.3333 4.16663 18.3333Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15.8334 18.3333C17.2141 18.3333 18.3334 17.214 18.3334 15.8333C18.3334 14.4526 17.2141 13.3333 15.8334 13.3333C14.4527 13.3333 13.3334 14.4526 13.3334 15.8333C13.3334 17.214 14.4527 18.3333 15.8334 18.3333Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4.27502 7.5C4.65002 8.95833 5.98336 10.0417 7.55836 10.0333L10.4167 10.025C12.6 10.0167 14.4584 11.4167 15.1417 13.3667" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      name: "MRWeb",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.3333 10.8333V7.5C18.3333 3.33333 16.6666 1.66667 12.5 1.66667H7.49996C3.33329 1.66667 1.66663 3.33333 1.66663 7.5V12.5C1.66663 16.6667 3.33329 18.3333 7.49996 18.3333H12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15.8333 18.3333V13.3333L14.1666 15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15.8334 13.3333L17.5 15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.29163 5.21667L7.41663 13.1083" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.925 5.21667L10.05 13.1083" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.44165 7.85H13.3333" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 10.4833H12.8917" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      name: "DCGen",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 8H8V12H12V8Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.49999 15C7.32499 15 7.99998 14.325 7.99998 13.5V12H6.49999C5.67499 12 5 12.675 5 13.5C5 14.325 5.67499 15 6.49999 15Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.49999 8.00001H7.99998V6.49999C7.99998 5.67499 7.32499 5 6.49999 5C5.67499 5 5 5.67499 5 6.49999C5 7.32499 5.67499 8.00001 6.49999 8.00001Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8.00001H13.5C14.325 8.00001 15 7.32499 15 6.49999C15 5.67499 14.325 5 13.5 5C12.675 5 12 5.67499 12 6.49999V8.00001Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.5 15C14.325 15 15 14.325 15 13.5C15 12.675 14.325 12 13.5 12H12V13.5C12 14.325 12.675 15 13.5 15Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7.49996 18.3333H12.5C16.6666 18.3333 18.3333 16.6667 18.3333 12.5V7.5C18.3333 3.33333 16.6666 1.66667 12.5 1.66667H7.49996C3.33329 1.66667 1.66663 3.33333 1.66663 7.5V12.5C1.66663 16.6667 3.33329 18.3333 7.49996 18.3333Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      name: "Design2Code",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.08329 15.8083H6.66663C3.33329 15.8083 1.66663 14.975 1.66663 10.8083V6.64164C1.66663 3.30831 3.33329 1.64164 6.66663 1.64164H13.3333C16.6666 1.64164 18.3333 3.30831 18.3333 6.64164V10.8083C18.3333 14.1416 16.6666 15.8083 13.3333 15.8083H12.9166C12.6583 15.8083 12.4083 15.9333 12.25 16.1417L11 17.8083C10.45 18.5417 9.54995 18.5417 8.99995 17.8083L7.74995 16.1417C7.61662 15.9583 7.31663 15.8083 7.08329 15.8083Z" stroke="currentColor" strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.66667 7.25001L5 8.91667L6.66667 10.5833" stroke="currentColor" strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.3334 7.25001L15 8.91667L13.3334 10.5833" stroke="currentColor" strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.8333 6.975L9.16663 10.8584" stroke="currentColor" strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      name: "DesignBench",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.49996 18.3333H12.5C16.6666 18.3333 18.3333 16.6667 18.3333 12.5V7.5C18.3333 3.33334 16.6666 1.66667 12.5 1.66667H7.49996C3.33329 1.66667 1.66663 3.33334 1.66663 7.5V12.5C1.66663 16.6667 3.33329 18.3333 7.49996 18.3333Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.00002 7.47501L5.92502 9.55001C5.68336 9.79167 5.68336 10.2 5.92502 10.4417L8.00002 12.5167" stroke="currentColor" strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 7.47501L14.075 9.55001C14.3167 9.79167 14.3167 10.2 14.075 10.4417L12 12.5167" stroke="currentColor" strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="sticky top-32">
        <div className="w-64 flex flex-col rounded-2xl border border-[rgba(226,232,240,0.5)] bg-white/80 shadow-sm backdrop-blur-md">
          <div className="flex flex-col items-center gap-4 px-4 py-6">
            <div className="w-full">
              <div className="text-text-secondary font-bold text-xs leading-4 tracking-[0.6px] uppercase">
                WebPAIBench
              </div>
            </div>
            <nav className="flex flex-col gap-1 w-full">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.name.toLowerCase()}`}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    item.active
                      ? "bg-blue-light shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] text-blue-primary"
                      : "text-text-secondary hover:bg-gray-50"
                  }`}
                >
                  <div className={item.active ? "text-blue-primary" : "text-text-secondary"}>
                    {item.icon}
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className={`font-medium text-sm leading-5 ${item.active ? "text-blue-primary" : ""}`}>
                      {item.name}
                    </div>
                  </div>
                  {item.active && (
                    <div className="flex items-end ml-auto">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#2B7FFF] shadow-[0_0_8px_0_rgba(59,130,246,0.6)]" />
                    </div>
                  )}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </aside>
  );
}
