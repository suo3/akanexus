import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Book, Code, Zap, Settings, Palette, Shield, FileText, Lightbulb, Loader2, Layout, Rocket, BookOpen, HelpCircle, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface DocumentationSection {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string;
  content: string | null;
  order_index: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Book,
  Code,
  Zap,
  Settings,
  Palette,
  Shield,
  FileText,
  Lightbulb,
  Layout,
  Rocket,
  BookOpen,
  HelpCircle,
};

const fallbackSections = [
  {
    id: "1",
    slug: "getting-started",
    icon: "Zap",
    title: "Getting Started",
    description: "Quick start guide to get up and running with Akanexus components in minutes.",
  },
  {
    id: "2",
    slug: "installation",
    icon: "Code",
    title: "Installation",
    description: "Learn how to install and configure Akanexus in your React project.",
  },
  {
    id: "3",
    slug: "theming",
    icon: "Palette",
    title: "Theming",
    description: "Customize colors, fonts, and styles to match your brand perfectly.",
  },
  {
    id: "4",
    slug: "components-api",
    icon: "Book",
    title: "Components API",
    description: "Detailed API reference for all components with props and examples.",
  },
  {
    id: "5",
    slug: "configuration",
    icon: "Settings",
    title: "Configuration",
    description: "Advanced configuration options for fine-tuning your setup.",
  },
  {
    id: "6",
    slug: "best-practices",
    icon: "Shield",
    title: "Best Practices",
    description: "Recommended patterns and practices for building with Akanexus.",
  },
];

const Documentation = () => {
  const [sections, setSections] = useState<DocumentationSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      const { data, error } = await (supabase
        .from('documentation_sections') as any)
        .select('id, slug, title, description, icon, content, order_index')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (error || !data || data.length === 0) {
        // Use fallback sections if no data
        setSections(fallbackSections as DocumentationSection[]);
      } else {
        setSections(data);
      }
      setLoading(false);
    };

    fetchSections();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-3xl" />
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



            {/* Doc Sections Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {sections.map((section) => {
                  const IconComponent = iconMap[section.icon] || Book;
                  return (
                    <Link
                      key={section.id}
                      to={`/documentation/${section.slug}`}
                      className="group glass p-6 hover:border-primary/50 transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {section.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
                      <span className="inline-flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Read more <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Documentation;
