import { useState } from "react";
import { BookOpen, Check, Copy, ExternalLink } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";

type CitationFormat = "bibtex" | "apa" | "mla";
type CitationGroup = "UIBenchKit" | "Benchmarks" | "Methods";

interface CitationEntry {
  id: string;
  name: string;
  group: CitationGroup;
  title: string;
  url: string;
  citations: Record<CitationFormat, string>;
}

const formatLabels: Record<CitationFormat, string> = {
  bibtex: "BibTeX",
  apa: "APA",
  mla: "MLA",
};

const citationEntries: CitationEntry[] = [
  {
    id: "uibenchkit",
    name: "UIBenchKit",
    group: "UIBenchKit",
    title: "UIBenchKit: A unified toolkit for design-to-code model evaluation",
    url: "https://arxiv.org/pdf/2605.13141",
    citations: {
      bibtex: `@misc{le2026uibenchkitunifiedtoolkitdesigntocode,
  title={UIBenchKit: A unified toolkit for design-to-code model evaluation},
  author={Chinh T. Le and Trevor Ong Yee Siang and Jingyu Xiao and Yuxuan Wan and Yintong Huo},
  year={2026},
  eprint={2605.13141},
  archivePrefix={arXiv},
  primaryClass={cs.SE},
  url={https://arxiv.org/abs/2605.13141}
}`,
      apa:
        "Le, C. T., Ong Yee Siang, T., Xiao, J., Wan, Y., & Huo, Y. (2026). UIBenchKit: A unified toolkit for design-to-code model evaluation. arXiv. https://arxiv.org/abs/2605.13141",
      mla:
        'Le, Chinh T., et al. "UIBenchKit: A Unified Toolkit for Design-to-Code Model Evaluation." arXiv, 2026, https://arxiv.org/abs/2605.13141.',
    },
  },
  {
    id: "design2code",
    name: "Design2Code",
    group: "Benchmarks",
    title:
      "Design2Code: Benchmarking Multimodal Code Generation for Automated Front-End Engineering",
    url: "https://arxiv.org/abs/2403.03163",
    citations: {
      bibtex: `@article{si2024design2code,
  title={Design2Code: Benchmarking Multimodal Code Generation for Automated Front-End Engineering},
  author={Si, Chenglei and Zhang, Yanzhe and Li, Ryan and Yang, Zhengyuan and Liu, Ruibo and Yang, Diyi},
  journal={arXiv preprint arXiv:2403.03163},
  year={2024},
  doi={10.48550/arXiv.2403.03163},
  url={https://arxiv.org/abs/2403.03163}
}`,
      apa:
        "Si, C., Zhang, Y., Li, R., Yang, Z., Liu, R., & Yang, D. (2024). Design2Code: Benchmarking multimodal code generation for automated front-end engineering. arXiv. https://doi.org/10.48550/arXiv.2403.03163",
      mla:
        'Si, Chenglei, et al. "Design2Code: Benchmarking Multimodal Code Generation for Automated Front-End Engineering." arXiv, 2024, https://doi.org/10.48550/arXiv.2403.03163.',
    },
  },
  {
    id: "dcgen-benchmark",
    name: "DCGen",
    group: "Benchmarks",
    title:
      "Automatically Generating UI Code from Screenshot: A Divide-and-Conquer-Based Approach",
    url: "https://arxiv.org/abs/2406.16386",
    citations: {
      bibtex: `@article{wan2024dcgen,
  title={Automatically Generating UI Code from Screenshot: A Divide-and-Conquer-Based Approach},
  author={Wan, Yuxuan and Wang, Chaozheng and Dong, Yi and Wang, Wenxuan and Li, Shuqing and Huo, Yintong and Lyu, Michael R.},
  journal={arXiv preprint arXiv:2406.16386},
  year={2024},
  doi={10.48550/arXiv.2406.16386},
  url={https://arxiv.org/abs/2406.16386}
}`,
      apa:
        "Wan, Y., Wang, C., Dong, Y., Wang, W., Li, S., Huo, Y., & Lyu, M. R. (2024). Automatically generating UI code from screenshot: A divide-and-conquer-based approach. arXiv. https://doi.org/10.48550/arXiv.2406.16386",
      mla:
        'Wan, Yuxuan, et al. "Automatically Generating UI Code from Screenshot: A Divide-and-Conquer-Based Approach." arXiv, 2024, https://doi.org/10.48550/arXiv.2406.16386.',
    },
  },
  {
    id: "dcgen-method",
    name: "DCGen",
    group: "Methods",
    title:
      "Automatically Generating UI Code from Screenshot: A Divide-and-Conquer-Based Approach",
    url: "https://arxiv.org/abs/2406.16386",
    citations: {
      bibtex: `@article{wan2024automatically,
  title={Automatically Generating UI Code from Screenshot: A Divide-and-Conquer-Based Approach},
  author={Wan, Yuxuan and Wang, Chaozheng and Dong, Yi and Wang, Wenxuan and Li, Shuqing and Huo, Yintong and Lyu, Michael R.},
  journal={arXiv preprint arXiv:2406.16386},
  year={2024},
  doi={10.48550/arXiv.2406.16386},
  url={https://arxiv.org/abs/2406.16386}
}`,
      apa:
        "Wan, Y., Wang, C., Dong, Y., Wang, W., Li, S., Huo, Y., & Lyu, M. R. (2024). Automatically generating UI code from screenshot: A divide-and-conquer-based approach. arXiv. https://doi.org/10.48550/arXiv.2406.16386",
      mla:
        'Wan, Yuxuan, et al. "Automatically Generating UI Code from Screenshot: A Divide-and-Conquer-Based Approach." arXiv, 2024, https://doi.org/10.48550/arXiv.2406.16386.',
    },
  },
  {
    id: "uicopilot",
    name: "UICopilot",
    group: "Methods",
    title:
      "UICopilot: Automating UI Synthesis via Hierarchical Code Generation from Webpage Designs",
    url: "https://arxiv.org/abs/2505.09904",
    citations: {
      bibtex: `@article{gui2025uicopilot,
  title={UICopilot: Automating UI Synthesis via Hierarchical Code Generation from Webpage Designs},
  author={Gui, Yi and Li, Zhen and Zhang, Zhongyi and Wan, Yao and Chen, Dongping and Zhang, Hongyu and Su, Yi and Chen, Bohua and Zhou, Xing and Jiang, Wenbin and Zhang, Xiangliang},
  journal={arXiv preprint arXiv:2505.09904},
  year={2025},
  doi={10.48550/arXiv.2505.09904},
  url={https://arxiv.org/abs/2505.09904}
}`,
      apa:
        "Gui, Y., Li, Z., Zhang, Z., Wan, Y., Chen, D., Zhang, H., Su, Y., Chen, B., Zhou, X., Jiang, W., & Zhang, X. (2025). UICopilot: Automating UI synthesis via hierarchical code generation from webpage designs. arXiv. https://doi.org/10.48550/arXiv.2505.09904",
      mla:
        'Gui, Yi, et al. "UICopilot: Automating UI Synthesis via Hierarchical Code Generation from Webpage Designs." arXiv, 2025, https://doi.org/10.48550/arXiv.2505.09904.',
    },
  },
  {
    id: "latcoder",
    name: "LaTCoder",
    group: "Methods",
    title: "LaTCoder: Converting Webpage Design to Code with Layout-as-Thought",
    url: "https://arxiv.org/abs/2508.03560",
    citations: {
      bibtex: `@article{gui2025latcoder,
  title={LaTCoder: Converting Webpage Design to Code with Layout-as-Thought},
  author={Gui, Yi and Li, Zhen and Zhang, Zhongyi and Wang, Guohao and Lv, Tianpeng and Jiang, Gaoyang and Liu, Yi and Chen, Dongping and Wan, Yao and Zhang, Hongyu and Jiang, Wenbin and Shi, Xuanhua and Jin, Hai},
  journal={arXiv preprint arXiv:2508.03560},
  year={2025},
  doi={10.48550/arXiv.2508.03560},
  url={https://arxiv.org/abs/2508.03560}
}`,
      apa:
        "Gui, Y., Li, Z., Zhang, Z., Wang, G., Lv, T., Jiang, G., Liu, Y., Chen, D., Wan, Y., Zhang, H., Jiang, W., Shi, X., & Jin, H. (2025). LaTCoder: Converting webpage design to code with layout-as-thought. arXiv. https://doi.org/10.48550/arXiv.2508.03560",
      mla:
        'Gui, Yi, et al. "LaTCoder: Converting Webpage Design to Code with Layout-as-Thought." arXiv, 2025, https://doi.org/10.48550/arXiv.2508.03560.',
    },
  },
  {
    id: "layoutcoder",
    name: "LayoutCoder",
    group: "Methods",
    title: "MLLM-Based UI2Code Automation Guided by UI Layout Information",
    url: "https://arxiv.org/abs/2506.10376",
    citations: {
      bibtex: `@article{wu2025mllm,
  title={MLLM-Based UI2Code Automation Guided by UI Layout Information},
  author={Wu, Fan and Gao, Cuiyun and Li, Shuqing and Wen, Xin-Cheng and Liao, Qing},
  journal={arXiv preprint arXiv:2506.10376},
  year={2025},
  doi={10.48550/arXiv.2506.10376},
  url={https://arxiv.org/abs/2506.10376}
}`,
      apa:
        "Wu, F., Gao, C., Li, S., Wen, X.-C., & Liao, Q. (2025). MLLM-based UI2Code automation guided by UI layout information. arXiv. https://doi.org/10.48550/arXiv.2506.10376",
      mla:
        'Wu, Fan, et al. "MLLM-Based UI2Code Automation Guided by UI Layout Information." arXiv, 2025, https://doi.org/10.48550/arXiv.2506.10376.',
    },
  },
];

const groups: CitationGroup[] = ["UIBenchKit", "Benchmarks", "Methods"];

export default function Citations() {
  const [format, setFormat] = useState<CitationFormat>("bibtex");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (entry: CitationEntry) => {
    await navigator.clipboard.writeText(entry.citations[format]);
    setCopiedId(entry.id);
    window.setTimeout(() => setCopiedId(null), 1600);
  };

  return (
    <>
      <Sidebar />
      <Header />
      <div className="min-h-screen bg-warm-bg lg:ml-64">
        <main className="px-6 sm:px-8 lg:px-12 pt-28 pb-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-100 text-amber-700 border border-amber-200">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">
                    Citations
                  </h1>
                  <p className="text-text-secondary mt-1">
                    Cite the benchmarks and generation methods used in UIBenchKit.
                  </p>
                </div>
              </div>

              <div className="inline-flex w-full sm:w-fit rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
                {(Object.keys(formatLabels) as CitationFormat[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFormat(key)}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                      format === key
                        ? "bg-amber-500 text-white"
                        : "text-gray-600 hover:bg-amber-50 hover:text-amber-700"
                    }`}
                  >
                    {formatLabels[key]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              {groups.map((group) => (
                <section key={group} className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-text-primary">
                      {group}
                    </h2>
                    <p className="text-sm text-text-secondary mt-1">
                      {group === "UIBenchKit"
                        ? "Cite this paper when using UIBenchKit as an evaluation toolkit."
                        : group === "Benchmarks"
                          ? "Cite these when reporting results on a benchmark dataset."
                          : "Cite these when comparing or using a specific generation method."}
                    </p>
                  </div>

                  <div className="grid gap-4">
                    {citationEntries
                      .filter((entry) => entry.group === group)
                      .map((entry) => (
                        <article
                          key={entry.id}
                          className="w-full min-w-0 rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-lg font-bold text-text-primary">
                                  {entry.name}
                                </h3>
                                <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                                  {group.slice(0, -1)}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-text-secondary">
                                {entry.title}
                              </p>
                              <a
                                href={entry.url}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:text-amber-800"
                              >
                                arXiv
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            </div>

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopy(entry)}
                              className="gap-2 shrink-0"
                            >
                              {copiedId === entry.id ? (
                                <>
                                  <Check className="h-4 w-4" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4" />
                                  Copy
                                </>
                              )}
                            </Button>
                          </div>

                          <pre className="mt-4 h-56 w-full min-w-0 max-w-full overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-800 whitespace-pre-wrap break-words">
                            <code className="whitespace-pre-wrap break-words">
                              {entry.citations[format]}
                            </code>
                          </pre>
                        </article>
                      ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
