import { defineStackbitConfig } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0",
  ssgName: "nextjs", // Change to "hugo", "gatsby", or "astro" if needed
  nodeVersion: "18", // Ensure this matches your project
  
  // This tells Netlify WHERE your content is in GitHub
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ["content"], // Folder where your pages/text live
      models: [
        {
          name: "Page",
          type: "page",
          urlPath: "/{slug}",
          filePath: "content/pages/{slug}.md",
        },
      ],
    }),
  ],

  // CRITICAL: Tells the visual editor how to "start" your site preview
  devCommand: "npm run dev", 
});
