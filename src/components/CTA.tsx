import { Button } from "@/components/ui/button";
import { ArrowRight, Blocks } from "lucide-react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-none blur-3xl" />
      </div>

      <div className="container relative z-10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-none bg-primary/10 border border-primary/20 mb-8">
            <Blocks className="w-8 h-8 text-primary" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tightest">
            Ready to build for <span className="text-gradient">free?</span>
          </h2>

          {/* Description */}
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mono-label opacity-70 max-w-2xl mx-auto mb-10">
            Produced by developers, for developers. All our tools are 100% free-to-use.
            If you find them useful, consider supporting the project with a donation.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/design-system-generator">
                Design Components
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="glass" size="xl" asChild>
              <Link to="/pricing">Support Us</Link>
            </Button>
          </div>

          {/* Trust Badge */}
          <p className="mt-8 text-sm text-muted-foreground">
            100% Free • Lifetime updates • Commercial license included
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
