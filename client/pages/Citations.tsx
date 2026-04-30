import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Citations() {
  return (
    <>
      <Sidebar />
      <Header />
      <div className="min-h-screen bg-warm-bg ml-64">
        <main className="px-8 lg:px-12 pt-28 pb-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-text-primary mb-6">Citations</h1>
            <p className="text-text-secondary text-lg mb-8">
              How to cite WebBench in your research.
            </p>

            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">Main Paper</h2>
                <pre className="bg-gray-50 p-4 rounded border border-gray-200 text-sm overflow-x-auto">
                  <code>
{`@article{webbench2025,
  title={WebBench: A Comprehensive Benchmark Suite for Web-Based AI Evaluation},
  author={Author Names},
  journal={Journal Name},
  year={2025},
  volume={1},
  pages={1-20}
}`}
                  </code>
                </pre>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">Individual Benchmarks</h2>
                <p className="text-text-secondary mb-4">
                  If you use a specific benchmark, please also cite the corresponding paper:
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">Interaction2Code</h3>
                    <pre className="bg-gray-50 p-4 rounded border border-gray-200 text-sm overflow-x-auto">
                      <code>
{`@article{interaction2code2025,
  title={Interaction2Code Benchmark},
  author={Author Names},
  year={2025}
}`}
                      </code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">Design2Code</h3>
                    <pre className="bg-gray-50 p-4 rounded border border-gray-200 text-sm overflow-x-auto">
                      <code>
{`@article{design2code2025,
  title={Design2Code Benchmark},
  author={Author Names},
  year={2025}
}`}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

