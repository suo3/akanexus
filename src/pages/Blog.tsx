import { Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const blogPosts = [
  {
    id: 1,
    title: "Building Scalable Design Systems with React",
    excerpt: "Learn how to create a design system that grows with your product and team. From tokens to components.",
    author: "Sarah Chen",
    date: "Dec 8, 2024",
    category: "Development",
    readTime: "8 min read",
  },
  {
    id: 2,
    title: "The Future of Frontend: AI-Powered Components",
    excerpt: "Exploring how AI is transforming the way we build and customize UI components for modern applications.",
    author: "Marcus Johnson",
    date: "Dec 5, 2024",
    category: "AI & Design",
    readTime: "6 min read",
  },
  {
    id: 3,
    title: "Mastering Tailwind CSS: Advanced Techniques",
    excerpt: "Take your Tailwind skills to the next level with these advanced patterns and best practices.",
    author: "Emily Rodriguez",
    date: "Dec 2, 2024",
    category: "Tutorial",
    readTime: "10 min read",
  },
  {
    id: 4,
    title: "Performance Optimization for React Applications",
    excerpt: "Practical tips and strategies to make your React apps blazing fast. From lazy loading to memoization.",
    author: "David Park",
    date: "Nov 28, 2024",
    category: "Performance",
    readTime: "12 min read",
  },
  {
    id: 5,
    title: "Accessibility First: Building Inclusive UIs",
    excerpt: "Why accessibility should be at the core of your design process, not an afterthought.",
    author: "Sarah Chen",
    date: "Nov 25, 2024",
    category: "Accessibility",
    readTime: "7 min read",
  },
  {
    id: 6,
    title: "Component Architecture Patterns That Scale",
    excerpt: "Architectural patterns for building maintainable, reusable component libraries for large applications.",
    author: "Marcus Johnson",
    date: "Nov 20, 2024",
    category: "Architecture",
    readTime: "9 min read",
  },
];

const Blog = () => {
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
                Our <span className="text-gradient">Blog</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Insights, tutorials, and updates from the Akanexus team. Learn about frontend development, design systems, and more.
              </p>
            </div>

            {/* Blog Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {blogPosts.map((post) => (
                <article
                  key={post.id}
                  className="group glass rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300"
                >
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary/30">A</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                        {post.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    </div>
                    <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.date}
                        </span>
                      </div>
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

export default Blog;
