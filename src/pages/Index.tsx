import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ComponentShowcase from "@/components/ComponentShowcase";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Index = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Akanexus",
    "description": "Premium React components, templates, and custom frontend development services.",
    "url": "https://akanexus.com",
    "sameAs": ["https://twitter.com/akanexus"],
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        description="Premium React components, complete templates, and custom frontend development services. Build stunning interfaces faster with shadcn/ui and Tailwind CSS."
        keywords="React components, frontend templates, shadcn, Tailwind CSS, web development, UI components"
        jsonLd={jsonLd}
      />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <ComponentShowcase />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
