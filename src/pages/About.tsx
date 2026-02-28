import { Users, Target, Wrench, Code2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const values = [
  {
    icon: Wrench,
    title: "Industrial-Grade, Free",
    description: "Every tool in our workspace is production-ready and 100% free to use — no paywalls, no trials, no hidden limits.",
  },
  {
    icon: Target,
    title: "Built for Creators",
    description: "Whether you're a solo developer, a designer, or a studio — our tools are engineered to cut work in half and raise the quality bar.",
  },
  {
    icon: Users,
    title: "Community-Powered",
    description: "Our blog links and tutorial registry are crowd-sourced. The best content rises to the top, shaped by the people who use it.",
  },
  {
    icon: Code2,
    title: "Custom Work Available",
    description: "Need something bespoke? Our team takes on custom frontend engineering projects — from greenfield apps to legacy rescues.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="About Us"
        description="Akanexus Studio is a free industrial toolset for creators — including a Design System Generator, community tutorials, and curated resources. Custom development services also available."
        keywords="about Akanexus, design system generator, free developer tools, custom frontend development, creator tools"
      />
      <Navbar />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-3xl" />
          </div>

          <div className="container relative z-10 px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                About <span className="text-gradient">Akanexus</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                A cross-discipline workbench for digital creators. We build free, industrial-grade tools — and take on custom work for those who require a dedicated engineering team.
              </p>
            </div>

            {/* Story Section */}
            <div className="max-w-4xl mx-auto mb-20">
              <div className="glass p-8 md:p-12">
                <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  Akanexus started as a workbench — a place to collect the tools we kept rebuilding on every project. Design tokens, component generators, pattern libraries, audio utilities. The kind of unglamorous infrastructure that makes the real work possible.
                </p>
                <p className="text-muted-foreground mb-4">
                  Instead of keeping it internal, we opened it up. Everything in the Akanexus workspace is free to use — no license drama, no subscription gates. The Design System Generator, community tutorials, curated blog links: all yours.
                </p>
                <p className="text-muted-foreground">
                  We sustain the project two ways: voluntary donations from people who find the tools valuable, and paid custom development work for clients who need a dedicated engineering team. That split keeps the free tools free — and lets us keep building.
                </p>
              </div>
            </div>

            {/* Values Grid */}
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-12">What We Stand For</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="group p-6 glass hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
