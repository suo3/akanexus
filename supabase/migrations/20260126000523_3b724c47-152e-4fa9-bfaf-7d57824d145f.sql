-- Create table for community blog links
CREATE TABLE public.blog_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'General',
    upvotes INTEGER NOT NULL DEFAULT 0,
    flags INTEGER NOT NULL DEFAULT 0,
    is_flagged BOOLEAN NOT NULL DEFAULT false,
    is_removed BOOLEAN NOT NULL DEFAULT false,
    submitted_by TEXT, -- optional name
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for tracking votes (by session/fingerprint to prevent duplicates)
CREATE TABLE public.blog_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id UUID REFERENCES public.blog_links(id) ON DELETE CASCADE NOT NULL,
    voter_hash TEXT NOT NULL, -- hash of IP or session to prevent duplicates
    vote_type TEXT NOT NULL DEFAULT 'upvote', -- 'upvote' or 'flag'
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(blog_id, voter_hash, vote_type)
);

-- Enable RLS
ALTER TABLE public.blog_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_votes ENABLE ROW LEVEL SECURITY;

-- Blog links policies: anyone can view non-removed posts
CREATE POLICY "Anyone can view active blog links"
ON public.blog_links
FOR SELECT
USING (is_removed = false);

-- Anyone can insert new blog links
CREATE POLICY "Anyone can submit blog links"
ON public.blog_links
FOR INSERT
WITH CHECK (true);

-- Only admins can update (for flagging/removal)
CREATE POLICY "Admins can update blog links"
ON public.blog_links
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete
CREATE POLICY "Admins can delete blog links"
ON public.blog_links
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Blog votes policies: anyone can view
CREATE POLICY "Anyone can view votes"
ON public.blog_votes
FOR SELECT
USING (true);

-- Anyone can insert votes
CREATE POLICY "Anyone can vote"
ON public.blog_votes
FOR INSERT
WITH CHECK (true);

-- Create function to increment upvotes
CREATE OR REPLACE FUNCTION public.increment_blog_upvotes(_blog_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE blog_links
  SET upvotes = upvotes + 1, updated_at = now()
  WHERE id = _blog_id AND is_removed = false;
END;
$$;

-- Create function to increment flags
CREATE OR REPLACE FUNCTION public.increment_blog_flags(_blog_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE blog_links
  SET flags = flags + 1, 
      is_flagged = CASE WHEN flags + 1 >= 3 THEN true ELSE is_flagged END,
      updated_at = now()
  WHERE id = _blog_id AND is_removed = false;
END;
$$;

-- Create trigger for updated_at
CREATE TRIGGER update_blog_links_updated_at
BEFORE UPDATE ON public.blog_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();