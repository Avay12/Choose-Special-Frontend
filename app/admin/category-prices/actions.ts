"use server";

import fs from "fs";
import path from "path";

export async function discoverFileSystemTemplates() {
  try {
    // We check root/components/templates
    const root = process.cwd();
    const templatesDir = path.join(root, "components", "templates");
    
    if (!fs.existsSync(templatesDir)) {
      console.error("Templates directory not found at:", templatesDir);
      return [];
    }

    const entries = fs.readdirSync(templatesDir, { withFileTypes: true });
    
    const discovered = entries
      .filter((entry) => entry.isDirectory())
      .map((dir) => {
        const categoryPath = path.join(templatesDir, dir.name);
        const files = fs.readdirSync(categoryPath);
        
        return {
          name: dir.name,
          templates: files
            .filter((file) => file.endsWith(".tsx"))
            .map((file) => file.replace(".tsx", "")),
        };
      });

    return discovered;
  } catch (error) {
    console.error("Discovery error in Server Action:", error);
    return [];
  }
}
