import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ExternalLink, Package, Star, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import * as LucideIcons from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  url: string;
  icon: string | null;
  preview_image_url?: string | null;
  is_featured: boolean;
  order_index?: number;
}

// Category color mapping using semantic design tokens
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Tool': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  'Library': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  'API': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  'Service': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  'Plugin': { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
  'Extension': { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30' },
  'Other': { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' },
};

const getCategoryColors = (category: string) => {
  return CATEGORY_COLORS[category] || { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border' };
};

// Helper to check if URL is internal (starts with /)
const isInternalUrl = (url: string) => url.startsWith('/');

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await (supabase
      .from('products') as any)
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true });
    
    if (!error && data) {
      setProducts(data);
      const uniqueCategories = ['All', ...new Set(data.map((p: Product) => p.category))];
      setCategories(uniqueCategories as string[]);
    }
    setLoading(false);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredProducts = filteredProducts.filter(p => p.is_featured);
  const regularProducts = filteredProducts.filter(p => !p.is_featured);

  const getIcon = (iconName: string | null) => {
    if (!iconName) return Package;
    const Icon = (LucideIcons as any)[iconName];
    return Icon || Package;
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Products & Tools"
        description="Discover Akanexus tools and products designed to help you build better applications. Audio mastering, development utilities, and more."
        keywords="developer tools, audio mastering, web development, React tools"
      />
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Our Products
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Tools & <span className="text-gradient">Products</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our collection of tools and products designed to help you build better applications.
            </p>
          </div>

          {/* Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-secondary border-border h-12"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-pulse text-muted-foreground">Loading products...</div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Package className="mx-auto text-muted-foreground mb-4" size={48} />
              <p className="text-muted-foreground">No products found</p>
            </div>
          ) : (
            <>
              {/* Featured Products */}
              {featuredProducts.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Star className="text-amber-500" size={24} />
                    Featured
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {featuredProducts.map((product, index) => {
                      const IconComponent = getIcon(product.icon);
                      const isInternal = isInternalUrl(product.url);
                      const CardWrapper = isInternal ? Link : 'a';
                      const cardProps = isInternal 
                        ? { to: product.url }
                        : { href: product.url, target: '_blank', rel: 'noopener noreferrer' };
                      
                      return (
                        <CardWrapper
                          key={product.id}
                          {...(cardProps as any)}
                          className="glass rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 animate-fade-up group flex gap-6"
                          style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                        >
                          {product.preview_image_url ? (
                            <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                              <img 
                                src={product.preview_image_url} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-24 h-24 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <IconComponent className="text-primary" size={36} />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">
                                <Star size={10} className="mr-1" />
                                Featured
                              </Badge>
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getCategoryColors(product.category).bg} ${getCategoryColors(product.category).text} ${getCategoryColors(product.category).border}`}>
                                {product.category}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                              {product.description || 'No description'}
                            </p>
                            <span className="inline-flex items-center text-primary text-sm font-medium">
                              {isInternal ? (
                                <>Try Now <ArrowRight size={14} className="ml-1" /></>
                              ) : (
                                <>Visit <ExternalLink size={14} className="ml-1" /></>
                              )}
                            </span>
                          </div>
                        </CardWrapper>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Regular Products */}
              {regularProducts.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularProducts.map((product, index) => {
                    const IconComponent = getIcon(product.icon);
                    const isInternal = isInternalUrl(product.url);
                    const CardWrapper = isInternal ? Link : 'a';
                    const cardProps = isInternal 
                      ? { to: product.url }
                      : { href: product.url, target: '_blank', rel: 'noopener noreferrer' };
                    
                    return (
                      <CardWrapper
                        key={product.id}
                        {...(cardProps as any)}
                        className="glass rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 animate-fade-up group"
                        style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                      >
                        <div className="flex items-start gap-4 mb-4">
                          {product.preview_image_url ? (
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={product.preview_image_url} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <IconComponent className="text-primary" size={24} />
                            </div>
                          )}
                          <div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getCategoryColors(product.category).bg} ${getCategoryColors(product.category).text} ${getCategoryColors(product.category).border}`}>
                              {product.category}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                          {product.description || 'No description'}
                        </p>
                        <span className="inline-flex items-center text-primary text-sm font-medium">
                          {isInternal ? (
                            <>Try Now <ArrowRight size={14} className="ml-1" /></>
                          ) : (
                            <>Visit <ExternalLink size={14} className="ml-1" /></>
                          )}
                        </span>
                      </CardWrapper>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
