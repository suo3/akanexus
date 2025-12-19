-- Allow anyone to increment download count on published components
CREATE POLICY "Anyone can increment downloads on published components"
ON public.marketplace_components
FOR UPDATE
USING (is_published = true)
WITH CHECK (is_published = true);

-- Allow anyone to increment download count on published templates
CREATE POLICY "Anyone can increment downloads on published templates"
ON public.marketplace_templates
FOR UPDATE
USING (is_published = true)
WITH CHECK (is_published = true);