-- Add slug column to documentation_sections
ALTER TABLE public.documentation_sections ADD COLUMN slug text UNIQUE;

-- Update all existing sections with friendly slugs
UPDATE public.documentation_sections SET slug = 'getting-started' WHERE title = 'Getting Started';
UPDATE public.documentation_sections SET slug = 'components-library' WHERE title = 'Components Library';
UPDATE public.documentation_sections SET slug = 'templates-guide' WHERE title = 'Templates Guide';
UPDATE public.documentation_sections SET slug = 'api-reference' WHERE title = 'API Reference';
UPDATE public.documentation_sections SET slug = 'best-practices' WHERE title = 'Best Practices';
UPDATE public.documentation_sections SET slug = 'faq' WHERE title = 'FAQ';

-- Make slug NOT NULL after all rows have values
ALTER TABLE public.documentation_sections ALTER COLUMN slug SET NOT NULL;

-- Delete API Reference section
DELETE FROM public.documentation_sections WHERE slug = 'api-reference';