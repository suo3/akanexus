import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Book, Code, Zap, Settings, Palette, Shield, FileText, Lightbulb, Loader2, Layout, Rocket, BookOpen, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

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

const DocumentationDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [section, setSection] = useState<DocumentationSection | null>(null);
  const [allSections, setAllSections] = useState<DocumentationSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch all published sections for navigation
      const { data: sections } = await (supabase
        .from('documentation_sections') as any)
        .select('id, slug, title, description, icon, content, order_index')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (sections) {
        setAllSections(sections);
      }

      // Fetch the specific section by slug
      const { data, error } = await (supabase
        .from('documentation_sections') as any)
        .select('id, slug, title, description, icon, content, order_index')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (!error && data) {
        setSection(data);
      }
      setLoading(false);
    };

    fetchData();
  }, [slug]);

  const currentIndex = allSections.findIndex(s => s.slug === slug);
  const prevSection = currentIndex > 0 ? allSections[currentIndex - 1] : null;
  const nextSection = currentIndex < allSections.length - 1 ? allSections[currentIndex + 1] : null;

  const IconComponent = section ? (iconMap[section.icon] || Book) : Book;

  // Simple markdown-like content renderer
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-foreground">{line.slice(3)}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold mt-8 mb-4 text-foreground">{line.slice(2)}</h1>;
      }
      // Bold text with **
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="font-semibold text-foreground my-2">{line.slice(2, -2)}</p>;
      }
      // List items
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="text-muted-foreground ml-4 my-1 flex items-start gap-2">
            <span className="text-primary mt-1.5">•</span>
            <span>{line.slice(2)}</span>
          </li>
        );
      }
      // Q&A format
      if (line.startsWith('**Q:')) {
        return <p key={index} className="font-semibold text-foreground mt-4">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('A:')) {
        return <p key={index} className="text-muted-foreground mb-4">{line}</p>;
      }
      // Empty lines
      if (line.trim() === '') {
        return <div key={index} className="h-2" />;
      }
      // Regular paragraphs
      return <p key={index} className="text-muted-foreground my-2">{line}</p>;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={32} />
        </main>
        <Footer />
      </div>
    );
  }

  if (!section) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container px-6">
            <div className="text-center max-w-xl mx-auto">
              <h1 className="text-3xl font-bold mb-4">Documentation Not Found</h1>
              <p className="text-muted-foreground mb-6">The documentation section you're looking for doesn't exist or has been removed.</p>
              <Button asChild>
                <Link to="/documentation">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Documentation
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container px-6">
          <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
            {/* Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <div className="sticky top-24">
                <Link 
                  to="/documentation" 
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Documentation
                </Link>
                
                <nav className="space-y-1">
                {allSections.map((s) => {
                    const SectionIcon = iconMap[s.icon] || Book;
                    return (
                      <Link
                        key={s.id}
                        to={`/documentation/${s.slug}`}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                          s.slug === slug
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        <SectionIcon className="w-4 h-4" />
                        {s.title}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <article className="flex-1 min-w-0">
              <div className="glass rounded-2xl p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <IconComponent className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">{section.title}</h1>
                    {section.description && (
                      <p className="text-muted-foreground mt-1">{section.description}</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-border/50 pt-8">
                  {section.content ? (
                    <div className="prose prose-invert max-w-none">
                      {renderContent(section.content)}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No content available for this section.</p>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-12 pt-8 border-t border-border/50">
                  {prevSection ? (
                    <Link
                      to={`/documentation/${prevSection.slug}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="text-sm">{prevSection.title}</span>
                    </Link>
                  ) : (
                    <div />
                  )}
                  {nextSection && (
                    <Link
                      to={`/documentation/${nextSection.slug}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <span className="text-sm">{nextSection.title}</span>
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Link>
                  )}
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DocumentationDetail;