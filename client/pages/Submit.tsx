import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Submit() {
  return (
    <>
      <Sidebar />
      <Header />
      <div className="min-h-screen bg-warm-bg ml-64">
        <main className="px-8 lg:px-12 pt-28 pb-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-text-primary mb-6">Submit Your Results</h1>
            <p className="text-text-secondary text-lg mb-8">
              Submit your model's benchmark results to appear on the leaderboard.
            </p>

            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">Submission Guidelines</h2>
                <ul className="space-y-3 text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-primary mt-1">•</span>
                    <span>Ensure your results are reproducible and include all necessary details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-primary mt-1">•</span>
                    <span>Include model architecture, training data, and hyperparameters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-primary mt-1">•</span>
                    <span>Provide links to code repositories and model checkpoints</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-primary mt-1">•</span>
                    <span>Follow our standardized evaluation protocol</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">How to Submit</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">Step 1: Prepare Your Results</h3>
                    <p className="text-text-secondary">
                      Run the benchmark suite on your model and collect all metrics.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">Step 2: Fill Out the Form</h3>
                    <p className="text-text-secondary">
                      Complete our submission form with your results and model details.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">Step 3: Verification</h3>
                    <p className="text-text-secondary">
                      Our team will review and verify your submission before adding it to the leaderboard.
                    </p>
                  </div>

                  <button className="mt-4 px-6 py-3 bg-amber-primary hover:bg-amber-light text-white rounded-lg transition-colors font-semibold">
                    Start Submission
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">Questions?</h2>
                <p className="text-text-secondary">
                  If you have questions about the submission process, please contact us at submit@webpaibench.org
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
