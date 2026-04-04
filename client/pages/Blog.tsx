import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Blog() {
  return (
    <>
      <Sidebar />
      <Header />
      <div className="min-h-screen bg-warm-bg ml-64">
        <main className="px-8 lg:px-12 pt-28 pb-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-text-primary mb-6">Blog</h1>
            <p className="text-text-secondary text-lg mb-8">
              Latest updates and insights from the WebPAIBench team.
            </p>

            <div className="space-y-6">
              <article className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-semibold text-text-primary mb-2">
                  Welcome to WebPAIBench
                </h2>
                <p className="text-sm text-text-muted mb-4">Posted on January 15, 2025</p>
                <p className="text-text-secondary">
                  We're excited to introduce WebPAIBench, a comprehensive benchmark suite for evaluating AI models.
                </p>
              </article>

              <article className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-semibold text-text-primary mb-2">
                  New Benchmarks Released
                </h2>
                <p className="text-sm text-text-muted mb-4">Posted on January 10, 2025</p>
                <p className="text-text-secondary">
                  We've added several new benchmarks to our suite. Check them out in the navigation.
                </p>
              </article>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
