import { Book, Code, Zap, Settings, Palette, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const docSections = [
  {
    icon: Zap,
    title: "Getting Started",
    description: "Quick start guide to get up and running with Akanexus components in minutes.",
    link: "#",
  },
  {
    icon: Code,
    title: "Installation",
    description: "Learn how to install and configure Akanexus in your React project.",
    link: "#",
  },
  {
    icon: Palette,
    title: "Theming",
    description: "Customize colors, fonts, and styles to match your brand perfectly.",
    link: "#",
  },
  {
    icon: Book,
    title: "Components API",
    description: "Detailed API reference for all components with props and examples.",
    link: "#",
  },
  {
    icon: Settings,
    title: "Configuration",
    description: "Advanced configuration options for fine-tuning your setup.",
    link: "#",
  },
  {
    icon: Shield,
    title: "Best Practices",
    description: "Recommended patterns and practices for building with Akanexus.",
    link: "#",
  },
];

const Documentation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="container relative z-10 px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                <span className="text-gradient">Documentation</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about using Akanexus components and templates. From installation to advanced customization.
              </p>
            </div>

            {/* Quick Start */}
            <div className="max-w-4xl mx-auto mb-16">
              <div className="glass rounded-2xl p-8">
                <h2 className="text-xl font-semibold mb-4">Quick Start</h2>
                <div className="bg-background/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <p className="text-muted-foreground mb-2"># Install Akanexus components</p>
                  <p className="text-primary">npm install @akanexus/ui</p>
                  <p className="text-muted-foreground mt-4 mb-2"># Import and use</p>
                  <p className="text-foreground">import {"{ Button }"} from '@akanexus/ui'</p>
                </div>
              </div>
            </div>

            {/* Doc Sections Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {docSections.map((section, index) => (
                <a
                  key={index}
                  href={section.link}
                  className="group glass rounded-xl p-6 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <section.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Documentation;
