-- Create tutorials table
CREATE TABLE public.tutorials (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    duration TEXT,
    level TEXT NOT NULL DEFAULT 'Beginner',
    author TEXT,
    thumbnail_url TEXT,
    video_url TEXT,
    content TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tutorials ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admins can manage all tutorials"
ON public.tutorials
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view published tutorials"
ON public.tutorials
FOR SELECT
USING (is_published = true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tutorials_updated_at
BEFORE UPDATE ON public.tutorials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample tutorials
INSERT INTO public.tutorials (title, slug, description, duration, level, author, order_index, is_published) VALUES
('Building Your First Dashboard', 'building-your-first-dashboard', 'Learn how to create a beautiful admin dashboard from scratch using Akanexus components.', '45 min', 'Beginner', 'Sarah Chen', 1, true),
('Creating Custom Themes', 'creating-custom-themes', 'Master the theming system and create stunning custom themes for your applications.', '30 min', 'Intermediate', 'Marcus Johnson', 2, true),
('Advanced Form Patterns', 'advanced-form-patterns', 'Build complex forms with validation, multi-step wizards, and dynamic fields.', '60 min', 'Advanced', 'Emily Rodriguez', 3, true),
('Responsive Layouts Masterclass', 'responsive-layouts-masterclass', 'Create pixel-perfect responsive layouts that work beautifully on all devices.', '40 min', 'Intermediate', 'David Park', 4, true),
('Animation & Micro-interactions', 'animation-micro-interactions', 'Add delightful animations and micro-interactions to enhance user experience.', '35 min', 'Intermediate', 'Sarah Chen', 5, true),
('E-commerce Storefront Setup', 'ecommerce-storefront-setup', 'Build a complete e-commerce storefront with product pages, cart, and checkout.', '90 min', 'Advanced', 'Marcus Johnson', 6, true);