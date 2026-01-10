-- 1. Create a secure function to increment downloads for components
CREATE OR REPLACE FUNCTION public.increment_component_downloads(_component_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE marketplace_components
  SET downloads = COALESCE(downloads, 0) + 1
  WHERE id = _component_id AND is_published = true;
END;
$$;

-- 2. Create a secure function to increment downloads for templates
CREATE OR REPLACE FUNCTION public.increment_template_downloads(_template_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE marketplace_templates
  SET downloads = COALESCE(downloads, 0) + 1
  WHERE id = _template_id AND is_published = true;
END;
$$;

-- 3. Drop the insecure UPDATE policies that allow any field modification
DROP POLICY IF EXISTS "Anyone can increment downloads on published components" ON marketplace_components;
DROP POLICY IF EXISTS "Anyone can increment downloads on published templates" ON marketplace_templates;

-- 4. Add DELETE policy for profiles (allow users to delete their own profile)
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = id);

-- 5. Allow admins to delete profiles too
CREATE POLICY "Admins can delete any profile"
ON public.profiles
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));