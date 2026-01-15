import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Download, Eye, Package, X, Copy, Check, Crown, Code } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import DonationDialog from '@/components/DonationDialog';

// Code preview component - shows actual code snippet
const CodePreview = ({ codeSnippet, size = 'small' }: { codeSnippet: string | null; size?: 'small' | 'large' }) => {
  if (!codeSnippet) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        <Code className="mr-2 h-4 w-4" />
        No code
      </div>
    );
  }

  const isSmall = size === 'small';
  
  // Truncate code for small preview
  const displayCode = isSmall 
    ? codeSnippet.split('\n').slice(0, 8).join('\n') + (codeSnippet.split('\n').length > 8 ? '\n...' : '')
    : codeSnippet;

  return (
    <div className={`h-full w-full overflow-hidden ${isSmall ? 'p-2' : 'p-4'}`}>
      <pre className={`h-full overflow-hidden rounded bg-secondary/80 p-2 ${isSmall ? 'text-[9px]' : 'text-xs'} leading-tight`}>
        <code className="text-muted-foreground whitespace-pre-wrap break-words font-mono">
          {displayCode}
        </code>
      </pre>
    </div>
  );
};

interface MarketplaceComponent {
  id: string;
  name: string;
  description: string | null;
  category: string;
  preview_image_url: string | null;
  code_snippet: string | null;
  price: number;
  is_premium: boolean;
  downloads: number;
}

const Gallery = () => {
  const [components, setComponents] = useState<MarketplaceComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [previewComponent, setPreviewComponent] = useState<MarketplaceComponent | null>(null);
  const [copied, setCopied] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<MarketplaceComponent | null>(null);

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    setLoading(true);
    const { data, error } = await (supabase
      .from('marketplace_components') as any)
      .select('*')
      .eq('is_published', true)
      .order('downloads', { ascending: false });
    
    if (!error && data) {
      setComponents(data);
      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(data.map((c: MarketplaceComponent) => c.category))];
      setCategories(uniqueCategories as string[]);
    }
    setLoading(false);
  };

  const handleDownload = async (component: MarketplaceComponent) => {
    // Increment download count using secure RPC function
    await (supabase.rpc as any)('increment_component_downloads', { _component_id: component.id });
    
    setSelectedComponent(component);
    setDonationOpen(true);
    
    // Refresh to update download count
    fetchComponents();
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredComponents = components.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comp.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || comp.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Component Marketplace
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Component <span className="text-gradient">Gallery</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse our collection of React components. Built with TypeScript and Tailwind CSS. 
              Preview code and download instantly.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-secondary border-border h-12"
              />
            </div>
            <Button variant="glass" className="gap-2 h-12">
              <Filter size={18} />
              Filters
            </Button>
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

          {/* Components Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-pulse text-muted-foreground">Loading components...</div>
            </div>
          ) : filteredComponents.length === 0 ? (
            <div className="text-center py-20">
              <Package className="mx-auto text-muted-foreground mb-4" size={48} />
              <p className="text-muted-foreground">No components found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredComponents.map((comp, index) => (
                <div
                  key={comp.id}
                  className="glass rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 animate-fade-up group"
                  style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                >
                  <div className="aspect-video bg-secondary/50 flex items-center justify-center border-b border-border relative overflow-hidden">
                    {/* Live Component Preview */}
                    <CodePreview codeSnippet={comp.code_snippet} size="small" />
                    {comp.is_premium && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">
                          <Crown size={12} className="mr-1" />
                          Premium
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-primary font-medium">{comp.category}</span>
                      <span className="text-xs text-muted-foreground">
                        {comp.downloads} downloads
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{comp.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {comp.description || 'No description'}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-lg font-bold ${comp.price > 0 ? 'text-foreground' : 'text-primary'}`}>
                        {comp.price > 0 ? `$${comp.price.toFixed(2)}` : 'Free'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="glass" 
                        size="sm" 
                        className="flex-1 gap-2"
                        onClick={() => setPreviewComponent(comp)}
                      >
                        <Eye size={16} />
                        Preview
                      </Button>
                      <Button 
                        variant="hero" 
                        size="sm" 
                        className="flex-1 gap-2"
                        onClick={() => handleDownload(comp)}
                      >
                        <Download size={16} />
                        Get
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Preview Dialog */}
      <Dialog open={!!previewComponent} onOpenChange={() => setPreviewComponent(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {previewComponent?.name}
              {previewComponent?.is_premium && (
                <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">
                  <Crown size={12} className="mr-1" />
                  Premium
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto space-y-4">
            {/* Live Preview */}
            <div className="rounded-lg border border-border bg-secondary/30 p-8 min-h-[200px] flex items-center justify-center">
              <CodePreview codeSnippet={previewComponent?.code_snippet || null} size="large" />
            </div>
            
            {/* Description */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
              <p className="text-foreground">{previewComponent?.description || 'No description available'}</p>
            </div>
            
            {/* Code Snippet */}
            {previewComponent?.code_snippet && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Code</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleCopyCode(previewComponent.code_snippet!)}
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} className="mr-2" />
                        Copy Code
                      </>
                    )}
                  </Button>
                </div>
                <pre className="bg-secondary rounded-lg p-4 overflow-x-auto text-sm">
                  <code className="text-foreground">{previewComponent.code_snippet}</code>
                </pre>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <span className={`text-xl font-bold ${previewComponent?.price && previewComponent.price > 0 ? 'text-foreground' : 'text-primary'}`}>
              {previewComponent?.price && previewComponent.price > 0 ? `$${previewComponent.price.toFixed(2)}` : 'Free'}
            </span>
            <Button 
              variant="hero"
              onClick={() => {
                if (previewComponent) handleDownload(previewComponent);
                setPreviewComponent(null);
              }}
            >
              <Download size={18} className="mr-2" />
              Download Component
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <DonationDialog
        open={donationOpen}
        onOpenChange={setDonationOpen}
        itemName={selectedComponent?.name || ''}
        itemId={selectedComponent?.id || ''}
        itemType="component"
      />
    </div>
  );
};

export default Gallery;
