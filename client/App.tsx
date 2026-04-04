import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Interaction2Code from "./pages/Interaction2Code";
import MRWeb from "./pages/MRWeb";
import DCGen from "./pages/DCGen";
import Design2Code from "./pages/Design2Code";
import DesignBench from "./pages/DesignBench";
import Paper from "./pages/Paper";
import Docs from "./pages/Docs";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Citations from "./pages/Citations";
import Press from "./pages/Press";
import Submit from "./pages/Submit";
import LiveDemo from "./pages/LiveDemo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/interaction2code" element={<Interaction2Code />} />
          <Route path="/mrweb" element={<MRWeb />} />
          <Route path="/dcgen" element={<DCGen />} />
          <Route path="/design2code" element={<Design2Code />} />
          <Route path="/designbench" element={<DesignBench />} />
          <Route path="/live-demo" element={<LiveDemo />} />
          <Route path="/paper" element={<Paper />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/citations" element={<Citations />} />
          <Route path="/press" element={<Press />} />
          <Route path="/submit" element={<Submit />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
