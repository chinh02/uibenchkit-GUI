import { ExternalLink, GitPullRequest, Github } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

const experimentsRepoUrl = "https://github.com/chinh02/uibenchkit-experiments";
const huggingFaceDatasetUrl = "https://huggingface.co/datasets/chinh02/UIBenchKit";

const checklist = [
  "Raw UIBenchKit run artifacts uploaded to the Hugging Face dataset under raw-data/<run_id>/.",
  "A lightweight submissions/<run_id>.json manifest pointing to the Hugging Face artifact path.",
  "Regenerated leaderboard CSV and JSON files produced by summarize_leaderboard.py.",
  "A short pull request note with dataset, method, model, run ID, UIBenchKit version, and any known failures.",
];

const steps = [
  {
    title: "Upload raw artifacts",
    body: "Upload the completed UIBenchKit run folder to the Hugging Face dataset. Keep the folder name identical to the run ID.",
    code: `raw-data/<dataset>_<method>_<model>_<YYYYMMDD>_<HHMMSS>/
  evaluation.json
  run_metadata.json
  results.json
  cost_report.json
  *.html
  *.png`,
  },
  {
    title: "Clone the experiments repository",
    body: "Fork or clone the lightweight repository that stores submission manifests and generated leaderboard files.",
    code: `git clone ${experimentsRepoUrl}.git
cd uibenchkit-experiments
git checkout -b submit/my-model-results`,
  },
  {
    title: "Add a submission manifest",
    body: "Create submissions/<run_id>.json with the dataset, method, model, and Hugging Face artifact location.",
    code: `{
  "run_id": "<run_id>",
  "dataset": "dcgen",
  "method": "direct",
  "model": "gpt-4o",
  "artifact_source": "huggingface",
  "artifact_repo": "chinh02/UIBenchKit",
  "artifact_repo_type": "dataset",
  "artifact_revision": "main",
  "artifact_path": "raw-data/<run_id>",
  "uibenchkit_version": "main",
  "notes": ""
}`,
  },
  {
    title: "Regenerate leaderboard files",
    body: "Run the summarizer so the GUI-facing CSV and JSON files include your submission.",
    code: `python -m pip install tiktoken huggingface_hub
python summarize_leaderboard.py`,
  },
  {
    title: "Open a pull request",
    body: "Commit the manifest and regenerated leaderboard files. Do not commit raw HTML, PNG, or full run artifact folders.",
    code: `git add submissions/ leaderboard/
git commit -m "Add benchmark results for <model-name>"
git push origin submit/my-model-results`,
  },
  {
    title: "Manual review and merge",
    body: "After the PR is checked for completeness and consistency, maintainers merge it. The website reads leaderboard data from GitHub, so merged rows become visible after the next refresh or deploy.",
  },
];

export default function Submit() {
  return (
    <>
      <Sidebar />
      <Header />
      <div className="min-h-screen bg-warm-bg lg:ml-64">
        <main className="px-6 sm:px-8 lg:px-12 pt-28 pb-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
                Submit Your Results
              </h1>
              <p className="text-text-secondary text-lg">
                UIBenchKit leaderboard submissions use Hugging Face for raw artifacts and GitHub pull requests for lightweight manifests.
              </p>
            </div>

            <div className="space-y-6">
              <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-text-primary">
                      Results Repository
                    </h2>
                    <p className="mt-2 text-text-secondary">
                      Upload raw artifacts to Hugging Face, then open a pull request to the experiments repository with the submission manifest and regenerated leaderboard files.
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                    <a
                      href={experimentsRepoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-light"
                    >
                      <Github className="h-4 w-4" />
                      Experiments Repo
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href={huggingFaceDatasetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-200 bg-white px-4 py-2.5 text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-50"
                    >
                      Raw Artifacts
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Submission Package
                </h2>
                <ul className="space-y-3 text-text-secondary">
                  {checklist.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-text-primary mb-5">
                  How to Submit
                </h2>
                <div className="space-y-5">
                  {steps.map((step, index) => (
                    <div key={step.title} className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-text-primary">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-text-secondary">{step.body}</p>
                        {step.code && (
                          <pre className="mt-3 w-full overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800">
                            <code>{step.code}</code>
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-amber-200 bg-amber-50/70 p-6">
                <div className="flex items-start gap-3">
                  <GitPullRequest className="mt-1 h-5 w-5 shrink-0 text-amber-700" />
                  <div>
                    <h2 className="font-semibold text-amber-800">
                      Review policy
                    </h2>
                    <p className="mt-1 text-sm text-amber-800/80">
                      Submissions are not added automatically. We manually check that the Hugging Face artifacts are reachable, the manifest metadata is reproducible, and the regenerated leaderboard files are consistent before approval.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
