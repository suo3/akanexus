import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Download, Eye } from 'lucide-react';
import DonationDialog from '@/components/DonationDialog';

const components = [
  { id: 1, name: 'Animated Button', category: 'Buttons', preview: 'Interactive button with hover animations' },
  { id: 2, name: 'Glass Card', category: 'Cards', preview: 'Frosted glass effect card component' },
  { id: 3, name: 'Data Table', category: 'Tables', preview: 'Sortable and filterable data table' },
  { id: 4, name: 'Modal Dialog', category: 'Modals', preview: 'Accessible modal with animations' },
  { id: 5, name: 'Toast Notifications', category: 'Feedback', preview: 'Stackable toast notification system' },
  { id: 6, name: 'Date Picker', category: 'Forms', preview: 'Calendar date picker component' },
  { id: 7, name: 'Dropdown Menu', category: 'Navigation', preview: 'Animated dropdown with submenus' },
  { id: 8, name: 'Progress Bar', category: 'Feedback', preview: 'Animated progress indicators' },
];

const categories = ['All', 'Buttons', 'Cards', 'Tables', 'Modals', 'Feedback', 'Forms', 'Navigation'];

const Gallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [donationOpen, setDonationOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string>('');

  const filteredComponents = components.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || comp.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (componentName: string) => {
    setSelectedComponent(componentName);
    setDonationOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              100% Free
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Component <span className="text-gradient">Gallery</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse our free collection of React components. Built with TypeScript and Tailwind CSS. 
              Optional donations help us create more resources.
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredComponents.map((comp, index) => (
              <div
                key={comp.id}
                className="glass rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 animate-fade-up group"
                style={{ animationDelay: `${0.3 + index * 0.05}s` }}
              >
                <div className="aspect-video bg-secondary/50 flex items-center justify-center border-b border-border">
                  <div className="text-muted-foreground text-sm">{comp.preview}</div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-primary font-medium">{comp.category}</span>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      Free
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">{comp.name}</h3>
                  <div className="flex gap-2">
                    <Button variant="glass" size="sm" className="flex-1 gap-2">
                      <Eye size={16} />
                      Preview
                    </Button>
                    <Button 
                      variant="hero" 
                      size="sm" 
                      className="flex-1 gap-2"
                      onClick={() => handleDownload(comp.name)}
                    >
                      <Download size={16} />
                      Get
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      <DonationDialog
        open={donationOpen}
        onOpenChange={setDonationOpen}
        itemName={selectedComponent}
        itemType="component"
      />
    </div>
  );
};

export default Gallery;
