import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import JSZip from "https://esm.sh/jszip@3.10.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { itemId, itemType } = await req.json();

    if (!itemId || !itemType) {
      throw new Error("Missing itemId or itemType");
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    let zipContent: JSZip;
    let fileName: string;

    if (itemType === "component") {
      // Fetch component data
      const { data: component, error } = await supabaseClient
        .from("marketplace_components")
        .select("*")
        .eq("id", itemId)
        .single();

      if (error || !component) {
        throw new Error("Component not found");
      }

      // Create ZIP file
      zipContent = new JSZip();
      
      // Add component file
      const componentCode = component.code_snippet || `// ${component.name} Component\n// No code available`;
      zipContent.file(`${component.name.replace(/\s+/g, "")}.tsx`, componentCode);
      
      // Add README
      const readme = `# ${component.name}

${component.description || "No description available."}

## Category
${component.category}

## Usage
Import and use this component in your React project:

\`\`\`tsx
import ${component.name.replace(/\s+/g, "")} from './${component.name.replace(/\s+/g, "")}';

function App() {
  return <${component.name.replace(/\s+/g, "")} />;
}
\`\`\`

## License
Free to use in personal and commercial projects.
`;
      zipContent.file("README.md", readme);
      
      fileName = `${component.name.replace(/\s+/g, "-").toLowerCase()}-component.zip`;
    } else if (itemType === "template") {
      // Fetch template data
      const { data: template, error } = await supabaseClient
        .from("marketplace_templates")
        .select("*")
        .eq("id", itemId)
        .single();

      if (error || !template) {
        throw new Error("Template not found");
      }

      // Create ZIP file
      zipContent = new JSZip();
      
      // Add template README with all info
      const features = template.features ? template.features.join("\n- ") : "No features listed";
      const readme = `# ${template.name}

${template.description || "No description available."}

## Category
${template.category}

## Features
- ${features}

${template.demo_url ? `## Demo\nView live demo: ${template.demo_url}` : ""}

## Getting Started
1. Extract this ZIP file
2. Run \`npm install\` to install dependencies
3. Run \`npm run dev\` to start the development server

## License
Free to use in personal and commercial projects.
`;
      zipContent.file("README.md", readme);
      
      // Add a basic package.json
      const packageJson = {
        name: template.name.toLowerCase().replace(/\s+/g, "-"),
        version: "1.0.0",
        description: template.description || "",
        scripts: {
          dev: "vite",
          build: "vite build",
          preview: "vite preview"
        },
        dependencies: {
          react: "^18.3.1",
          "react-dom": "^18.3.1"
        },
        devDependencies: {
          "@types/react": "^18.3.1",
          "@types/react-dom": "^18.3.1",
          typescript: "^5.0.0",
          vite: "^5.0.0",
          "@vitejs/plugin-react": "^4.0.0"
        }
      };
      zipContent.file("package.json", JSON.stringify(packageJson, null, 2));
      
      // Add a basic index.html
      const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${template.name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
      zipContent.file("index.html", indexHtml);
      
      // Add basic src files
      zipContent.file("src/main.tsx", `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`);
      
      zipContent.file("src/App.tsx", `function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">${template.name}</h1>
        <p className="text-gray-600">${template.description || "Your template is ready!"}</p>
      </div>
    </div>
  );
}

export default App;`);
      
      zipContent.file("src/index.css", `@tailwind base;
@tailwind components;
@tailwind utilities;`);
      
      fileName = `${template.name.replace(/\s+/g, "-").toLowerCase()}-template.zip`;
    } else {
      throw new Error("Invalid item type");
    }

    // Generate ZIP file as base64
    const zipBase64 = await zipContent.generateAsync({ type: "base64" });

    console.log(`Generated ZIP for ${itemType}: ${fileName}`);

    return new Response(
      JSON.stringify({ 
        zipData: zipBase64,
        fileName 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error generating download:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
