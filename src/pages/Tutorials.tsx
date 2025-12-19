import { useEffect, useState } from "react";
import { Play, Clock, User, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface Tutorial {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  duration: string | null;
  level: string;
  author: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
}

const getLevelColor = (level: string) => {
  switch (level) {
    case "Beginner":
      return "bg-green-500/10 text-green-500";
    case "Intermediate":
      return "bg-yellow-500/10 text-yellow-500";
    case "Advanced":
      return "bg-red-500/10 text-red-500";
    default:
      return "bg-primary/10 text-primary";
  }
};

const Tutorials = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutorials = async () => {
      const { data, error } = await (supabase
        .from('tutorials') as any)
        .select('id, title, slug, description, duration, level, author, thumbnail_url, video_url')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (!error && data) {
        setTutorials(data);
      }
      setLoading(false);
    };

    fetchTutorials();
  }, []);

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
                <span className="text-gradient">Tutorials</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Step-by-step video tutorials to help you master Akanexus components and build amazing applications.
              </p>
            </div>

            {/* Tutorials Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : tutorials.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No tutorials available yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {tutorials.map((tutorial) => (
                  <article
                    key={tutorial.id}
                    className="group glass rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 cursor-pointer"
                    onClick={() => tutorial.video_url && window.open(tutorial.video_url, '_blank')}
                  >
                    <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative overflow-hidden">
                      {tutorial.thumbnail_url ? (
                        <img
                          src={tutorial.thumbnail_url}
                          alt={tutorial.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-primary/30">{tutorial.title.split(' ')[0]}</span>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/50">
                        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                          <Play className="w-6 h-6 text-primary-foreground ml-1" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded ${getLevelColor(tutorial.level)}`}>
                          {tutorial.level}
                        </span>
                        {tutorial.duration && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {tutorial.duration}
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {tutorial.title}
                      </h2>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {tutorial.description}
                      </p>
                      {tutorial.author && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <User className="w-3 h-3" />
                          {tutorial.author}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Tutorials;
