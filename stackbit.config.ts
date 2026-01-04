import { defineStackbitConfig } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0",
  // Since Vite is a build tool and not a framework itself, 
  // 'custom' tells the editor to rely on your specific devCommand.
  ssgName: "custom", 
  nodeVersion: "20", // Vite 6 works best on Node 18 or 20
  
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ["content"],
      models: [
        {
          name: "Page",
          type: "page",
          urlPath: "/{slug}",
          filePath: "content/pages/{slug}.json",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "seo_description", type: "string" }
          ]
        }
      ],
    }),
  ],

  // Matches your "dev": "vite" script exactly
  devCommand: "npm run dev", 

  // Vite usually defaults to port 5173 (not 3000)
  previewUrl: "http://localhost:5173",
});
