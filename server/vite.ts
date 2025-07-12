import path from "path";
import fs from "fs";
import express from "express";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";

// ESM dirname shim
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Used in production
export function serveStatic(app: express.Express) {
  const clientDist = path.resolve(__dirname, "..", "dist", "public");

  if (!fs.existsSync(clientDist)) {
    throw new Error(
      `❌ Could not find the build directory: ${clientDist}. Run \`npm run build\` from project root.`
    );
  }

  app.use(express.static(clientDist));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

// Used in development
export async function setupVite(app: express.Express, server: any) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);
}

// Logger
export const log = (...args: any[]) => {
  console.log("[server]", ...args);
};
