import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Paper() {
  return (
    <>
      <Sidebar />
      <Header />
      <div className="min-h-screen bg-warm-bg ml-64">
        <main className="px-8 lg:px-12 pt-28 pb-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-text-primary mb-6">Research Paper</h1>
            <div className="prose prose-lg max-w-none">
              <p className="text-text-secondary mb-6">
                Detailed information about the research paper will be available here.
              </p>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">Abstract</h2>
                <p className="text-text-secondary leading-relaxed">
                  This section will contain the abstract of the research paper.
                </p>
              </div>

              <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">Citation</h2>
                <pre className="bg-gray-50 p-4 rounded border border-gray-200 text-sm overflow-x-auto">
                  <code>
{`@article{webpaibench2025,
  title={WebPAIBench: A Comprehensive Benchmark Suite},
  author={Author Names},
  journal={Journal Name},
  year={2025}
}`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
