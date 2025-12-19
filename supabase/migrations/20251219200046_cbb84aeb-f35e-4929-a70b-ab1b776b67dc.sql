-- Create documentation_sections table
CREATE TABLE public.documentation_sections (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT NOT NULL DEFAULT 'Book',
    content TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.documentation_sections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view published documentation"
ON public.documentation_sections
FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can manage all documentation"
ON public.documentation_sections
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_documentation_sections_updated_at
BEFORE UPDATE ON public.documentation_sections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();