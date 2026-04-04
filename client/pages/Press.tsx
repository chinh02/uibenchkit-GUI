import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Press() {
  return (
    <>
      <Sidebar />
      <Header />
      <div className="min-h-screen bg-warm-bg ml-64">
        <main className="px-8 lg:px-12 pt-28 pb-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-text-primary mb-6">Press & Media</h1>
            <p className="text-text-secondary text-lg mb-8">
              Media coverage and press releases about WebPAIBench.
            </p>

            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">Press Kit</h2>
                <p className="text-text-secondary mb-4">
                  Download our press kit for logos, screenshots, and official descriptions.
                </p>
                <button className="px-4 py-2 bg-amber-primary hover:bg-amber-light text-white rounded-lg transition-colors">
                  Download Press Kit
                </button>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">Recent Coverage</h2>
                <div className="space-y-4">
                  <article className="border-l-4 border-amber-primary pl-4">
                    <h3 className="font-semibold text-text-primary">
                      "New Benchmark Suite Revolutionizes AI Evaluation"
                    </h3>
                    <p className="text-sm text-text-muted">Tech News - January 15, 2025</p>
                  </article>

                  <article className="border-l-4 border-amber-primary pl-4">
                    <h3 className="font-semibold text-text-primary">
                      "WebPAIBench Launches Comprehensive Testing Platform"
                    </h3>
                    <p className="text-sm text-text-muted">AI Weekly - January 10, 2025</p>
                  </article>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">Media Contact</h2>
                <p className="text-text-secondary">
                  For media inquiries, please contact: press@webpaibench.org
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
