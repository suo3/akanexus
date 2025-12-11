import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-12">Last updated: January 2024</p>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using Akanexus services, you accept and agree to be bound by the terms 
                and provisions of this agreement. If you do not agree to these terms, please do not use 
                our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Upon purchasing our components, templates, or services, you are granted a non-exclusive, 
                non-transferable license to use the materials for personal or commercial projects.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>You may use the components in unlimited projects</li>
                <li>You may modify the components to suit your needs</li>
                <li>You may not redistribute or resell the components as standalone products</li>
                <li>You may not claim ownership of the original design or code</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Payment Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                All purchases are final and non-refundable, except as required by law. Prices are subject 
                to change without notice. Subscription services will automatically renew unless cancelled 
                before the renewal date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content, including but not limited to code, designs, graphics, and documentation, 
                is the property of Akanexus and is protected by copyright and other intellectual 
                property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                Akanexus shall not be liable for any indirect, incidental, special, consequential, or 
                punitive damages resulting from your use of or inability to use our services, even if 
                we have been advised of the possibility of such damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Service Modifications</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify, suspend, or discontinue any part of our services at any 
                time without prior notice. We may also update these terms from time to time, and your 
                continued use of our services constitutes acceptance of any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These terms shall be governed by and construed in accordance with applicable laws, 
                without regard to conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For any questions regarding these Terms of Service, please contact us at{" "}
                <a href="mailto:legal@akanexus.com" className="text-primary hover:underline">
                  legal@akanexus.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;