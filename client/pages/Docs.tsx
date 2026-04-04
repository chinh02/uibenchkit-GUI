import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Docs() {
  return (
    <>
      <Sidebar />
      <Header />
      <div className="min-h-screen bg-warm-bg ml-64">
        <main className="px-8 lg:px-12 pt-28 pb-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-text-primary mb-6">Documentation</h1>
            <div className="space-y-6">
              <p className="text-text-secondary text-lg">
                Comprehensive documentation for using the benchmark suite.
              </p>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">Getting Started</h2>
                <p className="text-text-secondary mb-4">
                  Learn how to set up and use the benchmark tools.
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-secondary">
                  <li>Installation instructions</li>
                  <li>Configuration guide</li>
                  <li>Running benchmarks</li>
                  <li>Interpreting results</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">API Reference</h2>
                <p className="text-text-secondary">
                  Detailed API documentation will be available here.
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
