import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import * as LucideIcons from "lucide-react";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  url: string;
  icon: string | null;
  preview_image_url?: string | null;
  is_featured: boolean;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Tool': { bg: 'bg-cyan-500/10', text: 'text-cyan-700 dark:text-cyan-400', border: 'border-cyan-500/30' },
  'Library': { bg: 'bg-purple-500/10', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-500/30' },
  'API': { bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-500/30' },
  'Service': { bg: 'bg-amber-500/10', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-500/30' },
  'Plugin': { bg: 'bg-rose-500/10', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-500/30' },
  'Extension': { bg: 'bg-violet-500/10', text: 'text-violet-700 dark:text-violet-400', border: 'border-violet-500/30' },
  'Music': { bg: 'bg-pink-500/10', text: 'text-pink-700 dark:text-pink-400', border: 'border-pink-500/30' },
  'Video': { bg: 'bg-red-500/10', text: 'text-red-700 dark:text-red-400', border: 'border-red-500/30' },
  'Audio': { bg: 'bg-orange-500/10', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-500/30' },
  'Design': { bg: 'bg-indigo-500/10', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-500/30' },
  'AI': { bg: 'bg-teal-500/10', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-500/30' },
  'Resource': { bg: 'bg-lime-500/10', text: 'text-lime-700 dark:text-lime-400', border: 'border-lime-500/30' },
  'Other': { bg: 'bg-slate-500/10', text: 'text-slate-700 dark:text-slate-400', border: 'border-slate-500/30' },
};

const getCategoryColors = (category: string) => {
  return CATEGORY_COLORS[category] || { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border' };
};

const isInternalUrl = (url: string) => url.startsWith('/');

const getIcon = (iconName: string | null) => {
  if (!iconName) return Package;
  const Icon = (LucideIcons as any)[iconName];
  return Icon || Package;
};

const Hero = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await (supabase
      .from('products') as any)
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true })
      .limit(6);

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-10">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 tool-grid opacity-[0.15]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>


      <div className="container relative z-10 px-6">
        {/* Hero Content */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-3 px-3 py-1.5 border border-border bg-muted/50 mb-8 mono-label">
            <div className="w-1.5 h-1.5 rounded-none bg-primary animate-pulse" />
            <span className="text-muted-foreground uppercase tracking-widest">Akanexus Workspace v1.0.4</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter mb-6">
            Industrial grade tools for{" "}
            <span className="text-gradient">creators</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Explore our collection of tools and products designed to supercharge your workflow.
          </p>
        </div>

        {/* Products Grid */}
        <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse text-muted-foreground">Loading products...</div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto text-muted-foreground mb-4" size={48} />
              <p className="text-muted-foreground">No products available yet</p>
            </div>
          ) : (
            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {products.map((product, index) => {
                const IconComponent = getIcon(product.icon);
                const isInternal = isInternalUrl(product.url);
                const colors = getCategoryColors(product.category);

                const cardContent = (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group relative border border-border bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-200 cursor-pointer overflow-hidden p-6"
                  >
                    {/* Tool Identifier Mockup */}
                    <div className="absolute top-0 right-0 p-2 opacity-20 transition-opacity group-hover:opacity-40">
                      <span className="mono-label text-[8px]">{product.id.split('-')[0]}</span>
                    </div>

                    <div className="flex items-start gap-4">
                      {product.preview_image_url ? (
                        <div className="w-12 h-12 rounded-none overflow-hidden flex-shrink-0">
                          <img
                            src={product.preview_image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-none bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="text-primary" size={24} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          {isInternal ? (
                            <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                          ) : (
                            <ExternalLink size={14} className="text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                        <Badge
                          variant="outline"
                          className={`${colors.bg} ${colors.text} ${colors.border} mono-label rounded-none border-0 px-0`}
                        >
                          // {product.category}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {product.description || 'No description available'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );

                if (isInternal) {
                  return (
                    <Link key={product.id} to={product.url}>
                      {cardContent}
                    </Link>
                  );
                }

                return (
                  <a
                    key={product.id}
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {cardContent}
                  </a>
                );
              })}
            </motion.div>
          )}

          {/* View All Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-10"
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background hover:bg-foreground/90 font-medium transition-all group border border-foreground"
            >
              <span className="mono-label tracking-widest">Browse full inventory</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
