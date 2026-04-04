import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Contact() {
  return (
    <>
      <Sidebar />
      <Header />
      <div className="min-h-screen bg-warm-bg ml-64">
        <main className="px-8 lg:px-12 pt-28 pb-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-text-primary mb-6">Contact Us</h1>
            <p className="text-text-secondary text-lg mb-8">
              Get in touch with the WebPAIBench team.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-text-primary mb-4">General Inquiries</h2>
                <p className="text-text-secondary mb-2">
                  Email: contact@webpaibench.org
                </p>
                <p className="text-text-secondary">
                  We typically respond within 24-48 hours.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Technical Support</h2>
                <p className="text-text-secondary mb-2">
                  Email: support@webpaibench.org
                </p>
                <p className="text-text-secondary">
                  For technical issues and bug reports.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Research Collaboration</h2>
                <p className="text-text-secondary mb-2">
                  Email: research@webpaibench.org
                </p>
                <p className="text-text-secondary">
                  For research partnerships and collaborations.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Social Media</h2>
                <div className="space-y-2 text-text-secondary">
                  <p>Twitter: @webpaibench</p>
                  <p>GitHub: github.com/webpaibench</p>
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
