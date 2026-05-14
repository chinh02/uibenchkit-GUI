import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FileText, Github, Database } from "lucide-react";

// Page configuration with title, subtitle, and links
interface PageConfig {
  title: string;
  subtitle?: string;
  paperUrl?: string;
  githubUrl?: string;
  datasetUrl?: string;
}

const pageConfigs: Record<string, PageConfig> = {
  '/': {
    title: 'UIBenchKit',
    subtitle: 'Unified Benchmarking for Design-to-Code Generation',
    paperUrl: 'https://arxiv.org/pdf/2605.13141',
    githubUrl: 'https://github.com/chinh02/UIBenchKit',
    datasetUrl: 'https://huggingface.co/datasets/chinh02/UIBenchKit/tree/main',
  },
  '/dcgen': {
    title: 'DCGen',
    subtitle: 'Automatically Generating UI Code from Screenshot:\nA Divide-and-Conquer-Based Approach',
    paperUrl: 'https://arxiv.org/abs/2406.16386',
    githubUrl: 'https://github.com/WebPAI/DCGen',
    datasetUrl: 'https://huggingface.co/datasets/iforgott/DCGen',
  },
  '/design2code': {
    title: 'Design2Code',
    subtitle: 'Design2Code: Benchmarking Multimodal Code Generation\nfor Automated Front-End Engineering',
    paperUrl: 'https://arxiv.org/abs/2403.03163',
    githubUrl: 'https://github.com/NoviScl/Design2Code',
    datasetUrl: 'https://huggingface.co/datasets/SALT-NLP/Design2Code',
  },
  '/citations': {
    title: 'Citations',
    subtitle: 'How to cite our work',
  },
  '/submit': {
    title: 'Submit',
    subtitle: 'Submit your results to the leaderboard',
  },
  '/live-demo': {
    title: 'Live Demo',
    subtitle: 'Image-to-Code Generation with UIBenchKit',
    paperUrl: 'https://arxiv.org/pdf/2605.13141',
    githubUrl: 'https://github.com/chinh02/UIBenchKit',
  },
};

export default function Header() {
  const location = useLocation();
  
  // Get the current page config based on route
  const getPageConfig = (): PageConfig => {
    return pageConfigs[location.pathname] || pageConfigs['/'];
  };

  const config = getPageConfig();

  useEffect(() => {
    document.title =
      config.title === "UIBenchKit" ? "UIBenchKit" : `${config.title} | UIBenchKit`;
  }, [config.title]);

  return (
    <div className="fixed top-0 left-0 lg:left-64 right-0 z-50" style={{ backgroundColor: '#de7a59' }}>
      <div className="px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between py-5">
          {/* Title */}
          <div className="flex items-center gap-5">
            <div className="flex flex-col">
              <h1 className="font-display text-3xl font-bold text-white">
                {config.title}
              </h1>
              {config.subtitle && (
                /* Add 'whitespace-pre-line' here */
                <p className="text-white/80 text-sm whitespace-pre-line">
                  {config.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Navigation Links - only show if links are defined */}
          <nav className="flex items-center gap-3">
            {config.paperUrl && (
              <a
                href={config.paperUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/20 transition-colors"
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium text-sm">Paper</span>
              </a>
            )}
            {config.githubUrl && (
              <a
                href={config.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/20 transition-colors"
              >
                <Github className="w-5 h-5" />
                <span className="font-medium text-sm">GitHub</span>
              </a>
            )}
            {config.datasetUrl && (
              <a
                href={config.datasetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/20 transition-colors"
              >
                <Database className="w-5 h-5" />
                <span className="font-medium text-sm">Dataset</span>
              </a>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}


