-- Create marketplace_components table
CREATE TABLE public.marketplace_components (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    preview_image_url TEXT,
    code_snippet TEXT,
    price DECIMAL(10,2) DEFAULT 0,
    is_premium BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    downloads INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create marketplace_templates table
CREATE TABLE public.marketplace_templates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    preview_image_url TEXT,
    demo_url TEXT,
    price DECIMAL(10,2) DEFAULT 0,
    is_premium BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    downloads INTEGER DEFAULT 0,
    features TEXT[],
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.marketplace_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_templates ENABLE ROW LEVEL SECURITY;

-- RLS policies for marketplace_components
CREATE POLICY "Admins can manage all components"
ON public.marketplace_components
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view published components"
ON public.marketplace_components
FOR SELECT
USING (is_published = true);

-- RLS policies for marketplace_templates
CREATE POLICY "Admins can manage all templates"
ON public.marketplace_templates
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view published templates"
ON public.marketplace_templates
FOR SELECT
USING (is_published = true);

-- Create triggers for updated_at
CREATE TRIGGER update_marketplace_components_updated_at
    BEFORE UPDATE ON public.marketplace_components
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marketplace_templates_updated_at
    BEFORE UPDATE ON public.marketplace_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();