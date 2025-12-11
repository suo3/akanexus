import { Users, Target, Sparkles, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description: "We're on a mission to make frontend development accessible, beautiful, and efficient for everyone.",
  },
  {
    icon: Sparkles,
    title: "Quality First",
    description: "Every component and template is crafted with attention to detail, performance, and accessibility.",
  },
  {
    icon: Users,
    title: "Developer-Focused",
    description: "Built by developers, for developers. We understand your needs because we share them.",
  },
  {
    icon: Heart,
    title: "Community-Powered",
    description: "Our community drives our roadmap. Your feedback shapes the future of Akanexus.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="container relative z-10 px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                About <span className="text-gradient">Akanexus</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                We're a team of passionate developers and designers building the future of frontend development. Our mission is to help you ship faster with premium components and templates.
              </p>
            </div>

            {/* Story Section */}
            <div className="max-w-4xl mx-auto mb-20">
              <div className="glass rounded-2xl p-8 md:p-12">
                <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  Akanexus was born from a simple frustration: building beautiful, consistent UIs from scratch takes too long. We spent countless hours recreating the same components, fixing the same edge cases, and wrestling with the same design decisions.
                </p>
                <p className="text-muted-foreground mb-4">
                  So we decided to change that. We built a library of premium, battle-tested components that just work. Components that look great out of the box but are endlessly customizable. Templates that give you a head start without boxing you in.
                </p>
                <p className="text-muted-foreground">
                  Today, thousands of developers trust Akanexus to help them build better products, faster. And we're just getting started.
                </p>
              </div>
            </div>

            {/* Values Grid */}
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-12">Our Values</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="group p-6 rounded-xl glass hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
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
