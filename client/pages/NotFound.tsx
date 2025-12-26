import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 text-amber-500">404</h1>
          <p className="text-xl text-text-secondary mb-6">Oops! Page not found</p>
          <a 
            href="/" 
            className="inline-flex items-center px-6 py-3 rounded-xl bg-amber-500 text-dark-bg font-semibold hover:bg-amber-400 transition-colors"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
