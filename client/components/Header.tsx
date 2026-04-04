import { Link, useLocation } from "react-router-dom";
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
    title: 'WebPAIBench',
    subtitle: 'Web AI Benchmarks for Code Generation',
    paperUrl: 'https://arxiv.org/abs/YOUR_PAPER_ID',
    githubUrl: 'https://github.com/chinh02/webpai-experiment',
    datasetUrl: 'https://huggingface.co/datasets/YOUR_DATASET',
  },
  '/interaction2code': {
    title: 'Interaction2Code',
    subtitle: 'Interaction2Code:\nHow Far Are We From Automatic Interactive Webpage Generation?',
    paperUrl: 'https://arxiv.org/pdf/2411.03292',
    githubUrl: 'https://github.com/WebPAI/Interaction2Code',
    datasetUrl: 'https://huggingface.co/datasets/whale99/Interaction2Code',
  },
  '/mrweb': {
    title: 'MRWeb',
    subtitle: 'MRWeb: An Exploration of Generating\n Multi-Page Resource-Aware Web Codefrom UI Designs',
    paperUrl: 'https://arxiv.org/abs/2412.15310',
    githubUrl: 'https://github.com/WebPAI/MRWeb',
    datasetUrl: 'https://github.com/WebPAI/MRWeb/tree/main/dataset_collection/all_data',
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
  '/designbench': {
    title: 'DesignBench',
    subtitle: 'DesignBench: A Comprehensive Benchmark\nfor MLLM-based Front-end Code Generation',
    paperUrl: 'https://arxiv.org/abs/2506.06251',
    githubUrl: 'https://github.com/WebPAI/DesignBench',
    datasetUrl: 'https://drive.google.com/drive/folders/1gCeg4LqO7VsOSpB70iMnKbNR8gfzUot_',
  },
  '/paper': {
    title: 'Paper',
    subtitle: 'Research publications and academic papers',
  },
  '/docs': {
    title: 'Documentation',
    subtitle: 'Guides and API documentation',
  },
  '/blog': {
    title: 'Blog',
    subtitle: 'Latest updates and insights',
  },
  '/contact': {
    title: 'Contact',
    subtitle: 'Get in touch with the team',
  },
  '/citations': {
    title: 'Citations',
    subtitle: 'How to cite our work',
  },
  '/press': {
    title: 'Press',
    subtitle: 'Media coverage and press releases',
  },
  '/submit': {
    title: 'Submit',
    subtitle: 'Submit your results to the leaderboard',
  },
  '/live-demo': {
    title: 'Live Demo',
    subtitle: 'Image to HTML Code Generation with DCGen',
    paperUrl: 'https://arxiv.org/abs/2406.16386',
    githubUrl: 'https://github.com/WebPAI/DCGen',
  },
};

export default function Header() {
  const location = useLocation();
  
  // Get the current page config based on route
  const getPageConfig = (): PageConfig => {
    return pageConfigs[location.pathname] || pageConfigs['/'];
  };

  const config = getPageConfig();

  return (
    <div className="fixed top-0 left-64 right-0 z-50" style={{ backgroundColor: '#de7a59' }}>
      <div className="px-8 lg:px-12">
        <div className="flex items-center justify-between py-5">
          {/* Logo and Title */}
          <div className="flex items-center gap-5">
            <Link to="/" className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center shadow-md">
                <img src="/logo.jpeg" alt="WebPAIBench Logo" className="w-full h-full object-cover" />
              </div>
            </Link>
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
