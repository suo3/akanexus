import { Play, Clock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const tutorials = [
  {
    id: 1,
    title: "Building Your First Dashboard",
    description: "Learn how to create a beautiful admin dashboard from scratch using Akanexus components.",
    duration: "45 min",
    level: "Beginner",
    author: "Sarah Chen",
    thumbnail: "Dashboard",
  },
  {
    id: 2,
    title: "Creating Custom Themes",
    description: "Master the theming system and create stunning custom themes for your applications.",
    duration: "30 min",
    level: "Intermediate",
    author: "Marcus Johnson",
    thumbnail: "Theming",
  },
  {
    id: 3,
    title: "Advanced Form Patterns",
    description: "Build complex forms with validation, multi-step wizards, and dynamic fields.",
    duration: "60 min",
    level: "Advanced",
    author: "Emily Rodriguez",
    thumbnail: "Forms",
  },
  {
    id: 4,
    title: "Responsive Layouts Masterclass",
    description: "Create pixel-perfect responsive layouts that work beautifully on all devices.",
    duration: "40 min",
    level: "Intermediate",
    author: "David Park",
    thumbnail: "Layouts",
  },
  {
    id: 5,
    title: "Animation & Micro-interactions",
    description: "Add delightful animations and micro-interactions to enhance user experience.",
    duration: "35 min",
    level: "Intermediate",
    author: "Sarah Chen",
    thumbnail: "Animation",
  },
  {
    id: 6,
    title: "E-commerce Storefront Setup",
    description: "Build a complete e-commerce storefront with product pages, cart, and checkout.",
    duration: "90 min",
    level: "Advanced",
    author: "Marcus Johnson",
    thumbnail: "E-commerce",
  },
];

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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {tutorials.map((tutorial) => (
                <article
                  key={tutorial.id}
                  className="group glass rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300"
                >
                  <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
                    <span className="text-2xl font-bold text-primary/30">{tutorial.thumbnail}</span>
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
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {tutorial.duration}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {tutorial.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {tutorial.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />
                      {tutorial.author}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Tutorials;
