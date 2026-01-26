-- Add community fields to tutorials table
ALTER TABLE public.tutorials 
ADD COLUMN IF NOT EXISTS upvotes integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS flags integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_flagged boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS is_removed boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS submitted_by text,
ADD COLUMN IF NOT EXISTS url text,
ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'General';

-- Create tutorial_votes table to track votes
CREATE TABLE public.tutorial_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tutorial_id uuid NOT NULL REFERENCES public.tutorials(id) ON DELETE CASCADE,
  voter_hash text NOT NULL,
  vote_type text NOT NULL DEFAULT 'upvote',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(tutorial_id, voter_hash, vote_type)
);

-- Enable RLS on tutorial_votes
ALTER TABLE public.tutorial_votes ENABLE ROW LEVEL SECURITY;

-- RLS policies for tutorial_votes
CREATE POLICY "Anyone can view votes" ON public.tutorial_votes FOR SELECT USING (true);
CREATE POLICY "Anyone can vote" ON public.tutorial_votes FOR INSERT WITH CHECK (true);

-- Update tutorials RLS to allow public submissions
DROP POLICY IF EXISTS "Anyone can view published tutorials" ON public.tutorials;
CREATE POLICY "Anyone can view active tutorials" ON public.tutorials FOR SELECT USING (is_removed = false AND is_published = true);
CREATE POLICY "Anyone can submit tutorials" ON public.tutorials FOR INSERT WITH CHECK (true);

-- Create increment functions for tutorials
CREATE OR REPLACE FUNCTION public.increment_tutorial_upvotes(_tutorial_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE tutorials
  SET upvotes = upvotes + 1, updated_at = now()
  WHERE id = _tutorial_id AND is_removed = false;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_tutorial_flags(_tutorial_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE tutorials
  SET flags = flags + 1, 
      is_flagged = CASE WHEN flags + 1 >= 3 THEN true ELSE is_flagged END,
      updated_at = now()
  WHERE id = _tutorial_id AND is_removed = false;
END;
$$;