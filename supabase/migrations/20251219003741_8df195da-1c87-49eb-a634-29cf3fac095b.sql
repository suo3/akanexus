-- Create storage bucket for component preview images
INSERT INTO storage.buckets (id, name, public)
VALUES ('component-previews', 'component-previews', true);

-- Allow admins to upload files
CREATE POLICY "Admins can upload component previews"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'component-previews' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to update files
CREATE POLICY "Admins can update component previews"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'component-previews' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to delete files
CREATE POLICY "Admins can delete component previews"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'component-previews' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow anyone to view component preview images (public bucket)
CREATE POLICY "Anyone can view component previews"
ON storage.objects
FOR SELECT
USING (bucket_id = 'component-previews');