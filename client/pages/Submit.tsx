import { ExternalLink, GitPullRequest, Github } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

const resultsRepoUrl = "https://github.com/chinh02/uibenchkit-experiments";

const checklist = [
  "Leaderboard result file with dataset, method, model, and metric columns filled in.",
  "Run artifacts needed for verification, including generated HTML, screenshots, reports, and logs when available.",
  "Clear model and method metadata, including provider, model version, prompting method, and evaluation timestamp.",
  "A short note in the pull request describing how the run was produced and anything unusual about the results.",
];

const steps = [
  {
    title: "Clone the results repository",
    body: "Fork or clone the repository that backs the public leaderboard, then create a new branch for your submission.",
    code: `git clone ${resultsRepoUrl}.git
cd uibenchkit-experiments
git checkout -b submit/my-model-results`,
  },
  {
    title: "Add your results and artifacts",
    body: "Place the leaderboard rows and verification artifacts in the matching dataset folders. Keep filenames descriptive and avoid overwriting existing submissions.",
  },
  {
    title: "Open a pull request",
    body: "Push your branch and open a pull request against the results repository. The UIBenchKit maintainers will review the files before they appear on the leaderboard.",
    code: `git add leaderboard/ evaluation/
git commit -m "Add benchmark results for <model-name>"
git push origin submit/my-model-results`,
  },
  {
    title: "Manual review and merge",
    body: "After the PR is checked for completeness and consistency, we manually approve and merge it. The website reads from GitHub, so merged data becomes visible on the leaderboard after the next refresh/deploy.",
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
                UIBenchKit leaderboard data is reviewed through GitHub pull requests.
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
                      Clone this repository, add your benchmark outputs and artifacts, then open a pull request for review.
                    </p>
                  </div>
                  <a
                    href={resultsRepoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-amber-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-light"
                  >
                    <Github className="h-4 w-4" />
                    GitHub Repo
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
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
                      Submissions are not added automatically. We manually check each pull request for complete artifacts, reproducible metadata, and consistent leaderboard formatting before approval.
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
