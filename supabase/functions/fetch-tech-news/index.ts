import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Internal categories from src/lib/categoryColors.ts
const KNOWN_CATEGORIES = new Set([
    "React",
    "JavaScript",
    "TypeScript",
    "Python",
    "Frontend",
    "Backend",
    "DevOps",
    "AI/ML",
    "Design",
    "Mobile",
    "General",
]);

// Map specific tags to internal categories
const TITLE_CASE_MAP: Record<string, string> = {
    "react": "React",
    "javascript": "JavaScript",
    "typescript": "TypeScript",
    "python": "Python",
    "frontend": "Frontend",
    "backend": "Backend",
    "devops": "DevOps",
    "ai": "AI/ML",
    "ml": "AI/ML",
    "machinelearning": "AI/ML",
    "design": "Design",
    "ux": "Design",
    "ui": "Design",
    "mobile": "Mobile",
    "android": "Mobile",
    "ios": "Mobile",
    "flutter": "Mobile",
    "reactnative": "Mobile",
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        console.log("Fetching tech news from Dev.to...");

        // Fetch top 5 tech articles from Dev.to
        // tag=tech ensuring broad tech coverage, top=1 for top rated recently
        const response = await fetch('https://dev.to/api/articles?tag=tech&top=1&per_page=5');

        if (!response.ok) {
            throw new Error(`Failed to fetch from Dev.to: ${response.statusText}`);
        }

        const articles = await response.json();
        const processedLinks = [];

        for (const article of articles) {
            // Determine category
            let category = "General";
            let foundMatch = false;

            if (article.tags && Array.isArray(article.tags)) {
                // 1. Try to find a direct mapping or exact match
                for (const tag of article.tags) {
                    const lowerTag = tag.toLowerCase();

                    // Check mapped tags
                    if (TITLE_CASE_MAP[lowerTag]) {
                        category = TITLE_CASE_MAP[lowerTag];
                        foundMatch = true;
                        break;
                    }

                    // Check case-insensitive match against known categories
                    const knownMatch = Array.from(KNOWN_CATEGORIES).find(c => c.toLowerCase() === lowerTag);
                    if (knownMatch) {
                        category = knownMatch;
                        foundMatch = true;
                        break;
                    }
                }

                // 2. If no match found, use the first tag capitalized as a new category
                if (!foundMatch && article.tags.length > 0) {
                    const firstTag = article.tags[0];
                    // Capitalize first letter
                    category = firstTag.charAt(0).toUpperCase() + firstTag.slice(1);
                }
            }

            // Check if link already exists to avoid duplicates
            const { data: existing } = await supabase
                .from('blog_links')
                .select('id')
                .eq('url', article.url)
                .single();

            if (!existing) {
                const { error } = await supabase
                    .from('blog_links')
                    .insert({
                        title: article.title,
                        url: article.url,
                        description: article.description,
                        category: category,
                        submitted_by: "Tech News Bot",
                        upvotes: 0,
                        flags: 0
                    });

                if (error) {
                    console.error(`Error inserting ${article.title}:`, error);
                } else {
                    processedLinks.push({ title: article.title, category });
                }
            }
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: `Processed ${articles.length} articles. Inserted ${processedLinks.length} new links.`,
                inserted: processedLinks
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error("Error:", error);
        return new Response(
            JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
