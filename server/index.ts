import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer({ maxHeaderSize: 131072 }, app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const defaultPort = parseInt(process.env.PORT || "3005", 10);

  function tryListen(p: number) {
    const s = server.listen(p, () => {
      console.log(`Server running on http://localhost:${p}/`);
    });

    s.once("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        console.warn(`Port ${p} is in use, attempting port ${p + 1}...`);
        tryListen(p + 1);
      } else {
        console.error("Server error:", err);
      }
    });
  }

  tryListen(defaultPort);
}

startServer().catch(console.error);
