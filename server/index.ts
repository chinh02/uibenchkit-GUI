import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleGitHubProxy } from "./routes/github-proxy";
import {
  handleUIBenchKitHealth,
  handleUIBenchKitSubmit,
  handleUIBenchKitUploadAndSubmit,
  handleUIBenchKitPoll,
  handleUIBenchKitReport,
  handleUIBenchKitResultImage,
  handleUIBenchKitResultHtml,
  handleUIBenchKitDownloadArtifacts,
  handleUIBenchKitUploadFolderAndSubmit,
  handleUIBenchKitListModels,
  handleUIBenchKitStopRun,
} from "./routes/uibenchkit-proxy";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  const uibenchkitProxySecret = process.env.UIBENCHKIT_PROXY_SECRET;
  if (uibenchkitProxySecret) {
    app.use("/api/uibenchkit", (req, res, next) => {
      if (req.header("x-uibenchkit-proxy-secret") !== uibenchkitProxySecret) {
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

  // UIBenchKit demo API proxy
  app.get("/api/uibenchkit/health", handleUIBenchKitHealth);
  app.post("/api/uibenchkit/submit", handleUIBenchKitSubmit);
  app.post("/api/uibenchkit/upload-and-submit", handleUIBenchKitUploadAndSubmit);
  app.post("/api/uibenchkit/upload-folder-and-submit", handleUIBenchKitUploadFolderAndSubmit);
  app.get("/api/uibenchkit/poll", handleUIBenchKitPoll);
  app.post("/api/uibenchkit/report", handleUIBenchKitReport);
  app.post("/api/uibenchkit/stop-run", handleUIBenchKitStopRun);
  app.post("/api/uibenchkit/list-models", handleUIBenchKitListModels);
  app.get("/api/uibenchkit/result-image/:runId/:instanceId", handleUIBenchKitResultImage);
  app.get("/api/uibenchkit/result-html/:runId/:instanceId", handleUIBenchKitResultHtml);
  app.get("/api/uibenchkit/download-artifacts/:runId", handleUIBenchKitDownloadArtifacts);

  return app;
}

