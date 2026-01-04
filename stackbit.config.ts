import { defineStackbitConfig } from "@stackbit/types";

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0",
  ssgName: "custom", // Vite projects use 'custom' in Stackbit
  nodeVersion: "20",
  
  contentSources: [
    {
      name: "git",
      type: "git",
      rootPath: __dirname,
      contentDirs: ["content"],
      models: [
        {
          name: "Page",
          type: "page",
          urlPath: "/{slug}",
          filePath: "content/pages/{slug}.json",
          fields: [
            { name: "title", type: "string", required: true, label: "Page Title" },
            { 
              name: "seo_description", 
              type: "string", 
              label: "AI/Search Description (Meta)" 
            },
            {
              name: "content_blocks",
              type: "markdown",
              label: "Main Page Content"
            }
          ]
        }
      ],
    } as any
  ],

  devCommand: "npm run dev",
  previewUrl: "http://localhost:5173", // Vite's default port
});
