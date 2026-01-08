import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const sampleProducts = [
  {
    name: "Component Builder",
    description: "A powerful visual tool for building React components with drag-and-drop functionality. Create complex UI components without writing code.",
    category: "Tool",
    url: "https://example.com/component-builder",
    icon: "Puzzle",
    is_featured: true,
    is_published: true,
    order_index: 1,
  },
  {
    name: "Design System Kit",
    description: "A comprehensive design system with tokens, components, and guidelines for building consistent user interfaces.",
    category: "Resource",
    url: "https://example.com/design-system",
    icon: "Palette",
    is_featured: true,
    is_published: true,
    order_index: 2,
  },
  {
    name: "Code Analyzer",
    description: "Analyze your codebase for performance issues, accessibility problems, and best practice violations.",
    category: "Tool",
    url: "https://example.com/code-analyzer",
    icon: "Code",
    is_featured: false,
    is_published: true,
    order_index: 3,
  },
  {
    name: "API Generator",
    description: "Generate REST and GraphQL APIs from your database schema automatically. Includes authentication and rate limiting.",
    category: "Tool",
    url: "https://example.com/api-generator",
    icon: "Server",
    is_featured: true,
    is_published: true,
    order_index: 4,
  },
  {
    name: "Icon Library Pro",
    description: "Over 5000 customizable icons for your projects. Available in SVG, PNG, and as React components.",
    category: "Resource",
    url: "https://example.com/icons",
    icon: "Star",
    is_featured: false,
    is_published: true,
    order_index: 5,
  },
  {
    name: "Performance Monitor",
    description: "Real-time performance monitoring for your web applications. Track Core Web Vitals and user experience metrics.",
    category: "Service",
    url: "https://example.com/performance",
    icon: "Gauge",
    is_featured: false,
    is_published: true,
    order_index: 6,
  },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting product seeding...");

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if products already exist
    const { data: existingProducts, error: checkError } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error("Error checking existing products:", checkError);
      throw checkError;
    }

    if (existingProducts && existingProducts.length > 0) {
      console.log("Products already exist, skipping seed");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Products already exist, skipping seed",
          count: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert sample products
    const { data, error } = await supabase
      .from('products')
      .insert(sampleProducts)
      .select();

    if (error) {
      console.error("Error inserting products:", error);
      throw error;
    }

    console.log(`Successfully seeded ${data.length} products`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully seeded ${data.length} products`,
        count: data.length,
        products: data
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Seed error:", error);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
