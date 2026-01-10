import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Download, Layout, Search, ExternalLink, Crown, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import DonationDialog from '@/components/DonationDialog';

interface MarketplaceTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  preview_image_url: string | null;
  demo_url: string | null;
  price: number;
  is_premium: boolean;
  downloads: number;
  features: string[] | null;
}

const Templates = () => {
  const [templates, setTemplates] = useState<MarketplaceTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [previewTemplate, setPreviewTemplate] = useState<MarketplaceTemplate | null>(null);
  const [donationOpen, setDonationOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MarketplaceTemplate | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    const { data, error } = await (supabase
      .from('marketplace_templates') as any)
      .select('*')
      .eq('is_published', true)
      .order('downloads', { ascending: false });
    
    if (!error && data) {
      setTemplates(data);
      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(data.map((t: MarketplaceTemplate) => t.category))];
      setCategories(uniqueCategories as string[]);
    }
    setLoading(false);
  };

  const handleDownload = async (template: MarketplaceTemplate) => {
    // Increment download count using secure RPC function
    await (supabase.rpc as any)('increment_template_downloads', { _template_id: template.id });
    
    setSelectedTemplate(template);
    setDonationOpen(true);
    
    // Refresh to update download count
    fetchTemplates();
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || template.category === activeCategory;
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
              Template Marketplace
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Pre-Built <span className="text-gradient">Templates</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Launch faster with our production-ready templates. Fully customizable and built with 
              modern best practices.
            </p>
          </div>

          {/* Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Search templates..."
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

          {/* Templates Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-pulse text-muted-foreground">Loading templates...</div>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-20">
              <Layout className="mx-auto text-muted-foreground mb-4" size={48} />
              <p className="text-muted-foreground">No templates found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTemplates.map((template, index) => (
                <div
                  key={template.id}
                  className="glass rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 animate-fade-up group"
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  {/* Preview */}
                  <div className="aspect-[16/10] bg-gradient-to-br from-secondary to-muted relative overflow-hidden">
                    {template.preview_image_url ? (
                      <img 
                        src={template.preview_image_url} 
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-muted-foreground">{template.category} Preview</span>
                      </div>
                    )}
                    {template.is_premium && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">
                          <Crown size={12} className="mr-1" />
                          Premium
                        </Badge>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <Button 
                        variant="glass" 
                        className="gap-2"
                        onClick={() => setPreviewTemplate(template)}
                      >
                        <Eye size={18} />
                        Preview
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-primary px-2 py-1 bg-primary/10 rounded-full">
                        {template.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {template.downloads} downloads
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-2">{template.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {template.description || 'No description'}
                    </p>

                    {/* Features */}
                    {template.features && template.features.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {template.features.slice(0, 4).map((feature) => (
                          <span
                            key={feature}
                            className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                        {template.features.length > 4 && (
                          <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                            +{template.features.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between">
                      <span className={`text-lg font-bold ${template.price > 0 ? 'text-foreground' : 'text-primary'}`}>
                        {template.price > 0 ? `$${template.price.toFixed(2)}` : 'Free'}
                      </span>
                      <Button 
                        variant="hero" 
                        className="gap-2"
                        onClick={() => handleDownload(template)}
                      >
                        <Download size={18} />
                        Download
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
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {previewTemplate?.name}
              {previewTemplate?.is_premium && (
                <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">
                  <Crown size={12} className="mr-1" />
                  Premium
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto space-y-6">
            {/* Preview Image or Demo */}
            {previewTemplate?.demo_url ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-muted-foreground">Live Demo</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => window.open(previewTemplate.demo_url!, '_blank')}
                  >
                    <ExternalLink size={14} className="mr-2" />
                    Open in New Tab
                  </Button>
                </div>
                <div className="rounded-lg overflow-hidden border border-border bg-white">
                  <iframe 
                    src={previewTemplate.demo_url} 
                    className="w-full h-[400px]"
                    title={`${previewTemplate.name} Demo`}
                  />
                </div>
              </div>
            ) : previewTemplate?.preview_image_url ? (
              <div className="rounded-lg overflow-hidden border border-border">
                <img 
                  src={previewTemplate.preview_image_url} 
                  alt={previewTemplate.name}
                  className="w-full"
                />
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-secondary/50 p-12 text-center">
                <Layout className="mx-auto text-muted-foreground mb-4" size={48} />
                <p className="text-muted-foreground">No preview available</p>
              </div>
            )}
            
            {/* Description */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
              <p className="text-foreground">{previewTemplate?.description || 'No description available'}</p>
            </div>
            
            {/* Features */}
            {previewTemplate?.features && previewTemplate.features.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Features</h4>
                <div className="grid grid-cols-2 gap-2">
                  {previewTemplate.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-foreground">
                      <Check size={16} className="text-primary" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <span className={`text-xl font-bold ${previewTemplate?.price && previewTemplate.price > 0 ? 'text-foreground' : 'text-primary'}`}>
              {previewTemplate?.price && previewTemplate.price > 0 ? `$${previewTemplate.price.toFixed(2)}` : 'Free'}
            </span>
            <div className="flex gap-2">
              {previewTemplate?.demo_url && (
                <Button 
                  variant="outline"
                  onClick={() => window.open(previewTemplate.demo_url!, '_blank')}
                >
                  <ExternalLink size={18} className="mr-2" />
                  View Demo
                </Button>
              )}
              <Button 
                variant="hero"
                onClick={() => {
                  if (previewTemplate) handleDownload(previewTemplate);
                  setPreviewTemplate(null);
                }}
              >
                <Download size={18} className="mr-2" />
                Download Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DonationDialog
        open={donationOpen}
        onOpenChange={setDonationOpen}
        itemName={selectedTemplate?.name || ''}
        itemId={selectedTemplate?.id || ''}
        itemType="template"
      />
    </div>
  );
};

export default Templates;
