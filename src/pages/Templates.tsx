import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Eye, ShoppingCart, Star } from 'lucide-react';

const templates = [
  {
    id: 1,
    name: 'E-Commerce Starter',
    description: 'Complete e-commerce frontend with product listings, cart, and checkout flow.',
    price: '$149',
    category: 'E-Commerce',
    rating: 4.9,
    reviews: 128,
    features: ['Product Grid', 'Shopping Cart', 'Checkout Flow', 'User Dashboard'],
  },
  {
    id: 2,
    name: 'Portfolio Pro',
    description: 'Stunning portfolio template for developers and designers.',
    price: '$79',
    category: 'Portfolio',
    rating: 4.8,
    reviews: 95,
    features: ['Projects Showcase', 'Blog Section', 'Contact Form', 'Dark Mode'],
  },
  {
    id: 3,
    name: 'Admin Dashboard',
    description: 'Feature-rich admin panel with analytics, tables, and user management.',
    price: '$199',
    category: 'Dashboard',
    rating: 4.9,
    reviews: 212,
    features: ['Analytics Charts', 'Data Tables', 'User Management', 'Role Permissions'],
  },
  {
    id: 4,
    name: 'SaaS Landing',
    description: 'High-converting landing page template for SaaS products.',
    price: '$99',
    category: 'Landing',
    rating: 4.7,
    reviews: 67,
    features: ['Hero Section', 'Pricing Tables', 'Testimonials', 'Feature Showcase'],
  },
  {
    id: 5,
    name: 'Blog Platform',
    description: 'Modern blog template with rich text support and categories.',
    price: '$89',
    category: 'Blog',
    rating: 4.6,
    reviews: 54,
    features: ['Article Layout', 'Categories', 'Author Profiles', 'Comments'],
  },
  {
    id: 6,
    name: 'Agency Website',
    description: 'Professional agency website with case studies and team pages.',
    price: '$129',
    category: 'Agency',
    rating: 4.8,
    reviews: 89,
    features: ['Case Studies', 'Team Grid', 'Services Page', 'Contact Form'],
  },
];

const Templates = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-up">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Pre-Built <span className="text-gradient">Templates</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Launch faster with our production-ready templates. Each template is fully customizable and built with modern best practices.
            </p>
          </div>

          {/* Templates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template, index) => (
              <div
                key={template.id}
                className="glass rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 animate-fade-up group"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                {/* Preview */}
                <div className="aspect-[16/10] bg-gradient-to-br from-secondary to-muted relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-muted-foreground">{template.category} Preview</span>
                  </div>
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <Button variant="glass" className="gap-2">
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
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-foreground">{template.rating}</span>
                      <span className="text-sm text-muted-foreground">({template.reviews})</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2">{template.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{template.description}</p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {template.features.map((feature) => (
                      <span
                        key={feature}
                        className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-foreground">{template.price}</span>
                    <Button variant="hero" className="gap-2">
                      <ShoppingCart size={18} />
                      Purchase
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Templates;
