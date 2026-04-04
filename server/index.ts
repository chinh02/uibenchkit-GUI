import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleGitHubProxy } from "./routes/github-proxy";
import {
  handleDCGenHealth,
  handleDCGenSubmit,
  handleDCGenUploadAndSubmit,
  handleDCGenPoll,
  handleDCGenReport,
  handleDCGenResultImage,
  handleDCGenResultHtml,
  handleDCGenUploadFolderAndSubmit,
} from "./routes/dcgen-proxy";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // GitHub proxy for fetching private repo data (replaces Netlify function)
  app.get("/.netlify/functions/github-proxy", handleGitHubProxy);

  // ── DCGen Demo API proxy ──────────────────────────────────
  app.get("/api/dcgen/health", handleDCGenHealth);
  app.post("/api/dcgen/submit", handleDCGenSubmit);
  app.post("/api/dcgen/upload-and-submit", handleDCGenUploadAndSubmit);
  app.post("/api/dcgen/upload-folder-and-submit", handleDCGenUploadFolderAndSubmit);
  app.get("/api/dcgen/poll", handleDCGenPoll);
  app.post("/api/dcgen/report", handleDCGenReport);
  app.get("/api/dcgen/result-image/:runId/:instanceId", handleDCGenResultImage);
  app.get("/api/dcgen/result-html/:runId/:instanceId", handleDCGenResultHtml);

  return app;
}
