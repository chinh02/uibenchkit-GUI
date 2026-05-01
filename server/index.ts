import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleGitHubProxy } from "./routes/github-proxy";
import {
  handleWebBenchHealth,
  handleWebBenchSubmit,
  handleWebBenchUploadAndSubmit,
  handleWebBenchPoll,
  handleWebBenchReport,
  handleWebBenchResultImage,
  handleWebBenchResultHtml,
  handleWebBenchDownloadArtifacts,
  handleWebBenchUploadFolderAndSubmit,
  handleWebBenchListModels,
  handleWebBenchStopRun,
} from "./routes/webbench-proxy";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  const webbenchProxySecret = process.env.WEBBENCH_PROXY_SECRET;
  if (webbenchProxySecret) {
    app.use("/api/webbench", (req, res, next) => {
      if (req.header("x-webbench-proxy-secret") !== webbenchProxySecret) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }
      next();
    });
  }

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // GitHub proxy for fetching private repo data (replaces Netlify function)
  app.get("/.netlify/functions/github-proxy", handleGitHubProxy);

  // WebBench demo API proxy
  app.get("/api/webbench/health", handleWebBenchHealth);
  app.post("/api/webbench/submit", handleWebBenchSubmit);
  app.post("/api/webbench/upload-and-submit", handleWebBenchUploadAndSubmit);
  app.post("/api/webbench/upload-folder-and-submit", handleWebBenchUploadFolderAndSubmit);
  app.get("/api/webbench/poll", handleWebBenchPoll);
  app.post("/api/webbench/report", handleWebBenchReport);
  app.post("/api/webbench/stop-run", handleWebBenchStopRun);
  app.post("/api/webbench/list-models", handleWebBenchListModels);
  app.get("/api/webbench/result-image/:runId/:instanceId", handleWebBenchResultImage);
  app.get("/api/webbench/result-html/:runId/:instanceId", handleWebBenchResultHtml);
  app.get("/api/webbench/download-artifacts/:runId", handleWebBenchDownloadArtifacts);

  return app;
}

