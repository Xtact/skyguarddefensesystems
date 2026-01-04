import { defineStackbitConfig } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0",
  ssgName: "nextjs", // Options: 'nextjs', 'hugo', 'gatsby', 'astro', 'eleventy'
  nodeVersion: "18", // Matches the environment Netlify will spin up for the preview
  
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ["content"], // Folder where your page data lives
      models: [
        {
          name: "Page",
          type: "page",
          urlPath: "/{slug}",
          filePath: "content/pages/{slug}.json", // Ensure this matches your actual file extensions
          fields: [
            { name: "title", type: "string", required: true, label: "Page Title" },
            { name: "body", type: "markdown", label: "Main Content" },
            
            // --- SEO & AI EXPOSURE SECTION ---
            { 
              name: "seo", 
              type: "object", 
              label: "SEO & AI Metadata",
              fields: [
                { 
                  name: "metaTitle", 
                  type: "string", 
                  label: "Meta Title (Search Result Heading)" 
                },
                { 
                  name: "metaDescription", 
                  type: "string", 
                  label: "Meta Description (AI Snippet & Search Summary)" 
                },
                { 
                  name: "ogImage", 
                  type: "image", 
                  label: "Social Share Image (OpenGraph)" 
                },
                {
                    name: "keywords",
                    type: "list",
                    items: { type: "string" },
                    label: "AI Keywords (Context for LLM Crawlers)"
                }
              ]
            }
          ]
        },
        {
          name: "Config",
          type: "data",
          label: "Global Settings",
          filePath: "content/data/config.json",
          fields: [
            { name: "siteName", type: "string", label: "Website Name" },
            { name: "logo", type: "image", label: "Company Logo" },
            { 
                name: "schemaOrg", 
                type: "markdown", 
                label: "JSON-LD Schema (Critical for AI/Search Clarity)" 
            }
          ]
        }
      ],
    }),
  ],

  // This tells Netlify how to run your local dev server for the live preview
  devCommand: "npm run dev", 

  // Directs the editor to the correct port (usually 3000 for Next.js)
  previewUrl: "http://localhost:3000",
});
