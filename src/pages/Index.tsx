import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ComponentShowcase from "@/components/ComponentShowcase";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
