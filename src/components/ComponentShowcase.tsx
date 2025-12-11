import { Button } from "@/components/ui/button";
import { Check, Copy, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const ComponentShowcase = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="components" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Components that{" "}
              <span className="text-gradient">just work</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Production-ready React components built with TypeScript and Tailwind CSS. 
              Copy, paste, and customize—it's that simple.
            </p>

            <div className="space-y-4 mb-8">
              {[
                "Fully typed with TypeScript",
                "Built on Radix UI primitives",
                "Dark mode support out of the box",
                "Accessible and keyboard navigable",
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <Button variant="hero" size="lg" asChild>
              <Link to="/gallery">
                Explore All Components
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Right Content - Code Preview */}
          <div className="relative">
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-float" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-float" style={{ animationDelay: "2s" }} />

            {/* Code Block */}
            <div className="relative rounded-2xl overflow-hidden glass">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs text-muted-foreground">Button.tsx</span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-md hover:bg-secondary transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>

              {/* Code Content */}
              <div className="p-6 font-mono text-sm overflow-x-auto">
                <pre className="text-muted-foreground">
                  <code>
                    <span className="text-primary">import</span> {"{"} Button {"}"} <span className="text-primary">from</span> <span className="text-green-400">"@akanexus/ui"</span>;{"\n\n"}
                    <span className="text-primary">export default function</span> <span className="text-accent">App</span>() {"{"}{"\n"}
                    {"  "}<span className="text-primary">return</span> ({"\n"}
                    {"    "}<span className="text-muted-foreground/70">{"<"}</span><span className="text-accent">Button</span>{"\n"}
                    {"      "}variant=<span className="text-green-400">"hero"</span>{"\n"}
                    {"      "}size=<span className="text-green-400">"lg"</span>{"\n"}
                    {"      "}onClick=<span className="text-muted-foreground">{"{"}</span>() ={">"} console.log(<span className="text-green-400">'clicked'</span>)<span className="text-muted-foreground">{"}"}</span>{"\n"}
                    {"    "}<span className="text-muted-foreground/70">{">"}</span>{"\n"}
                    {"      "}Get Started{"\n"}
                    {"    "}<span className="text-muted-foreground/70">{"</"}</span><span className="text-accent">Button</span><span className="text-muted-foreground/70">{">"}</span>{"\n"}
                    {"  "});{"\n"}
                    {"}"}
                  </code>
                </pre>
              </div>

              {/* Live Preview */}
              <div className="px-6 pb-6 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-4">Live Preview</p>
                <div className="flex items-center gap-4">
                  <Button variant="hero" size="lg">Get Started</Button>
                  <Button variant="glass" size="lg">Learn More</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComponentShowcase;
