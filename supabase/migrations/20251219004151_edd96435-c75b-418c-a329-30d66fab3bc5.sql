-- Insert sample components
INSERT INTO public.marketplace_components (name, description, category, code_snippet, price, is_premium, is_published, downloads) VALUES
('Animated Button', 'A beautiful animated button with hover effects and smooth transitions. Perfect for CTAs.', 'UI', '<Button className="group relative overflow-hidden bg-primary text-primary-foreground px-6 py-3 rounded-lg">
  <span className="relative z-10">Click Me</span>
  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
</Button>', 0, false, true, 42),

('Gradient Card', 'A stunning card component with gradient border and glassmorphism effect.', 'Cards', '<div className="relative p-[1px] rounded-xl bg-gradient-to-r from-primary via-purple-500 to-pink-500">
  <div className="bg-background rounded-xl p-6">
    <h3 className="text-xl font-bold">Card Title</h3>
    <p className="text-muted-foreground mt-2">Card content goes here</p>
  </div>
</div>', 0, false, true, 38),

('Pricing Toggle', 'A sleek monthly/yearly pricing toggle with smooth animations.', 'UI', '<div className="flex items-center gap-4 p-1 bg-secondary rounded-full">
  <button className="px-4 py-2 rounded-full bg-primary text-primary-foreground">Monthly</button>
  <button className="px-4 py-2 rounded-full text-muted-foreground hover:text-foreground">Yearly</button>
</div>', 4.99, true, true, 25),

('Stats Counter', 'Animated statistics counter with number animation effect.', 'UI', '<div className="text-center">
  <span className="text-4xl font-bold text-primary">1,234</span>
  <p className="text-muted-foreground">Active Users</p>
</div>', 0, false, true, 67),

('Search Input', 'A modern search input with icon and focus animations.', 'Forms', '<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
  <input 
    type="text" 
    placeholder="Search..." 
    className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary"
  />
</div>', 0, false, true, 53),

('Avatar Group', 'Stacked avatar group component perfect for showing team members.', 'UI', '<div className="flex -space-x-3">
  <img src="/avatar1.jpg" className="w-10 h-10 rounded-full border-2 border-background" />
  <img src="/avatar2.jpg" className="w-10 h-10 rounded-full border-2 border-background" />
  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-medium">+5</div>
</div>', 0, false, true, 31);

-- Insert sample templates
INSERT INTO public.marketplace_templates (name, description, category, demo_url, price, is_premium, is_published, downloads, features) VALUES
('SaaS Dashboard', 'A complete SaaS dashboard template with analytics, user management, and settings pages.', 'Dashboard', 'https://example.com/demo/saas', 29.99, true, true, 156, ARRAY['Analytics Charts', 'User Management', 'Dark Mode', 'Responsive Design', 'Settings Panel']),

('Startup Landing', 'Modern startup landing page with hero section, features, pricing, and testimonials.', 'Landing Page', 'https://example.com/demo/startup', 0, false, true, 234, ARRAY['Hero Section', 'Feature Grid', 'Pricing Table', 'Testimonials', 'CTA Sections']),

('E-commerce Store', 'Full-featured e-commerce template with product listings, cart, and checkout flow.', 'E-commerce', 'https://example.com/demo/store', 49.99, true, true, 89, ARRAY['Product Grid', 'Shopping Cart', 'Checkout Flow', 'Order History', 'Wishlist']),

('Developer Portfolio', 'Clean and minimal portfolio template for developers and designers.', 'Portfolio', 'https://example.com/demo/portfolio', 0, false, true, 312, ARRAY['Project Showcase', 'Skills Section', 'Contact Form', 'Blog Integration', 'Dark Mode']),

('Blog Platform', 'Feature-rich blog template with categories, tags, and comment system.', 'Blog', 'https://example.com/demo/blog', 19.99, true, true, 78, ARRAY['Category Pages', 'Tag System', 'Comments', 'Newsletter Signup', 'Related Posts']);