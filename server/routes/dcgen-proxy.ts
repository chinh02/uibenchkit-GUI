/**
 * DCGen API Proxy
 *
 * Proxies requests from the frontend to the DCGen Flask API server.
 * This keeps the DCGen API URL and API key on the server side.
 *
 * Environment variables:
 *   DCGEN_API_URL  - Base URL of the DCGen Flask server (default: http://localhost:5000)
 *   DCGEN_API_KEY  - API key for authenticating with DCGen
 */
import { RequestHandler } from "express";
import type {
  DCGenSubmitResponse,
  DCGenPollResponse,
  DCGenReportResponse,
  DCGenHealthResponse,
  DCGenResultImageResponse,
  DCGenResultHtmlResponse,
} from "@shared/api";

const DCGEN_API_URL =
  process.env.DCGEN_API_URL || "http://localhost:5000";
const DCGEN_API_KEY = process.env.DCGEN_API_KEY || "dev-api-key-12345";

/** Helper: proxy a JSON request to DCGen */
async function proxyToDCGen(
  path: string,
  method: "GET" | "POST" | "DELETE",
  body?: unknown,
  queryString?: string
): Promise<{ status: number; data: unknown }> {
  const url = `${DCGEN_API_URL}${path}${queryString ? `?${queryString}` : ""}`;
  const headers: Record<string, string> = {
    "x-api-key": DCGEN_API_KEY,
    "Content-Type": "application/json",
  };

  const fetchOpts: RequestInit = { method, headers };
  if (body && method !== "GET") {
    fetchOpts.body = JSON.stringify(body);
  }

  const resp = await fetch(url, fetchOpts);
  const data = await resp.json();
  return { status: resp.status, data };
}

// ─── Health ──────────────────────────────────────────────────
export const handleDCGenHealth: RequestHandler = async (_req, res) => {
  try {
    const { status, data } = await proxyToDCGen("/health", "GET");
    res.status(status).json(data);
  } catch (err) {
    res.status(502).json({
      message: "Cannot reach DCGen API server",
      error: String(err),
    });
  }
};

// ─── Submit ──────────────────────────────────────────────────
export const handleDCGenSubmit: RequestHandler = async (req, res) => {
  try {
    const { status, data } = await proxyToDCGen("/submit", "POST", req.body);
    res.status(status).json(data as DCGenSubmitResponse);
  } catch (err) {
    res.status(502).json({
      message: "Cannot reach DCGen API server",
      error: String(err),
    });
  }
};

// ─── Upload image and submit ─────────────────────────────────
/**
 * Accepts a JSON body with:
 *   - image: base64-encoded PNG/JPG
 *   - model: model name (e.g. "gemini", "claude")
 *   - method: method name (e.g. "dcgen", "direct")
 *   - reference_html: (optional) ground-truth HTML source code.
 *       When provided, it is saved as `input.html` in the temp input
 *       directory so that DCGen evaluation can compute code similarity
 *       and fine-grained metrics against the reference.
 *
 * Saves the image to a temp directory and calls /submit on DCGen API.
 */
export const handleDCGenUploadAndSubmit: RequestHandler = async (req, res) => {
  try {
    // We receive the image as base64 from the frontend
    const { image, model, method, reference_html, user_api_key, user_base_url } = req.body as {
      image: string;
      model: string;
      method: string;
      reference_html?: string;
      user_api_key?: string;
      user_base_url?: string;
    };

    if (!image || !model || !method) {
      res.status(400).json({
        message: "Missing required fields: image (base64), model, method",
      });
      return;
    }

    // Create a temporary directory, write the image, then call /submit
    const fs = await import("fs");
    const path = await import("path");
    const os = await import("os");

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcgen-demo-"));
    const imgBuffer = Buffer.from(image, "base64");
    const imgPath = path.join(tmpDir, "input.png");
    fs.writeFileSync(imgPath, imgBuffer);

    // Also copy a simple placeholder.png (1x1 transparent pixel)
    const placeholderBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    fs.writeFileSync(path.join(tmpDir, "placeholder.png"), placeholderBuffer);

    // Write reference HTML if provided (enables code similarity + fine-grained evaluation)
    // The file must be named `input.html` to match the image name `input.png`
    // so that DCGen's run_evaluation_for_run() can find it as the reference.
    if (reference_html && reference_html.trim()) {
      const refHtmlPath = path.join(tmpDir, "input.html");
      fs.writeFileSync(refHtmlPath, reference_html, "utf-8");
    }

    // Submit to DCGen with the temp directory as input_dir
    const submitBody: Record<string, unknown> = {
      model,
      method,
      input_dir: tmpDir,
      api_key: DCGEN_API_KEY,
    };
    if (user_api_key) submitBody.user_api_key = user_api_key;
    if (user_base_url) submitBody.user_base_url = user_base_url;

    const { status, data } = await proxyToDCGen("/submit", "POST", submitBody);
    res.status(status).json(data);
  } catch (err) {
    res.status(502).json({
      message: "Failed to upload and submit to DCGen",
      error: String(err),
    });
  }
};

// ─── Poll ────────────────────────────────────────────────────
export const handleDCGenPoll: RequestHandler = async (req, res) => {
  try {
    const runId = req.query.run_id as string;
    if (!runId) {
      res.status(400).json({ message: "run_id query parameter is required" });
      return;
    }
    const qs = `run_id=${encodeURIComponent(runId)}`;
    const { status, data } = await proxyToDCGen("/poll-jobs", "GET", undefined, qs);
    res.status(status).json(data as DCGenPollResponse);
  } catch (err) {
    res.status(502).json({
      message: "Cannot reach DCGen API server",
      error: String(err),
    });
  }
};

// ─── Report ──────────────────────────────────────────────────
export const handleDCGenReport: RequestHandler = async (req, res) => {
  try {
    const { status, data } = await proxyToDCGen(
      "/get-report",
      "POST",
      req.body
    );
    res.status(status).json(data as DCGenReportResponse);
  } catch (err) {
    res.status(502).json({
      message: "Cannot reach DCGen API server",
      error: String(err),
    });
  }
};

// ─── Upload folder and submit ───────────────────────────────
/**
 * Accepts a JSON body with:
 *   - files: Array<{ path: string; content: string; type: "image"|"html"|"css"|"other" }>
 *       Each file has its relative path and base64-encoded content.
 *   - model: model name
 *   - method: method name
 *
 * Writes all files to a temp directory:
 *   - Images are saved as .png (DCGen scans for *.png)
 *   - HTML files with names matching an image are kept as reference for evaluation
 *   - CSS and other assets are written as-is
 *
 * Then calls /submit with the temp dir as input_dir.
 */
export const handleDCGenUploadFolderAndSubmit: RequestHandler = async (
  req,
  res
) => {
  try {
    const { files, model, method, user_api_key, user_base_url } = req.body as {
      files: Array<{
        path: string;
        content: string;
        type: "image" | "html" | "css" | "other";
      }>;
      model: string;
      method: string;
      user_api_key?: string;
      user_base_url?: string;
    };

    if (!files || !Array.isArray(files) || files.length === 0) {
      res
        .status(400)
        .json({ message: "Missing required field: files (array)" });
      return;
    }
    if (!model || !method) {
      res.status(400).json({ message: "Missing required fields: model, method" });
      return;
    }

    const fs = await import("fs");
    const path = await import("path");
    const os = await import("os");

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcgen-folder-"));

    // Track image stems so we know which HTML files are references
    const imageStems = new Set<string>();

    // First pass: write image files as .png
    for (const file of files) {
      if (file.type !== "image") continue;
      const buf = Buffer.from(file.content, "base64");
      // Normalize name: strip original extension, always save as .png
      const baseName = path.basename(file.path);
      const stem = baseName.replace(/\.(png|jpe?g|gif|bmp|webp|svg|tiff?)$/i, "");
      const destName = `${stem}.png`;
      fs.writeFileSync(path.join(tmpDir, destName), buf);
      imageStems.add(stem);
    }

    // Second pass: write HTML, CSS, and other files
    for (const file of files) {
      if (file.type === "image") continue;
      const baseName = path.basename(file.path);
      const buf = Buffer.from(file.content, "base64");
      fs.writeFileSync(path.join(tmpDir, baseName), buf);
    }

    // Write a placeholder.png (1x1 transparent pixel)
    const placeholderBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    fs.writeFileSync(path.join(tmpDir, "placeholder.png"), placeholderBuffer);

    // Submit to DCGen
    const submitBody: Record<string, unknown> = {
      model,
      method,
      input_dir: tmpDir,
      api_key: DCGEN_API_KEY,
    };
    if (user_api_key) submitBody.user_api_key = user_api_key;
    if (user_base_url) submitBody.user_base_url = user_base_url;

    const { status, data } = await proxyToDCGen("/submit", "POST", submitBody);
    res.status(status).json(data);
  } catch (err) {
    res.status(502).json({
      message: "Failed to upload folder and submit to DCGen",
      error: String(err),
    });
  }
};

// ─── Result files (image / HTML) ─────────────────────────────
/**
 * Reads the generated screenshot PNG from the DCGen results directory.
 * GET /api/dcgen/result-image/:runId/:instanceId
 */
export const handleDCGenResultImage: RequestHandler = async (req, res) => {
  try {
    const { runId, instanceId } = req.params;
    const fs = await import("fs");
    const path = await import("path");

    // DCGen stores results at: <DCGEN_DIR>/results/<runId>/<instanceId>.png
    // We ask the DCGen API for the report to get the output_dir
    const { status, data } = await proxyToDCGen("/get-report", "POST", {
      run_id: runId,
    });

    if (status !== 200) {
      res.status(status).json(data);
      return;
    }

    const report = (data as DCGenReportResponse).report;
    const outputDir = (report.results as unknown as { output_dir?: string })
      ?.output_dir;

    if (!outputDir) {
      res.status(404).json({ message: "Output directory not found" });
      return;
    }

    const screenshotPath = path.join(outputDir, `${instanceId}.png`);
    if (!fs.existsSync(screenshotPath)) {
      res.status(404).json({ message: "Screenshot not found" });
      return;
    }

    const imageBuffer = fs.readFileSync(screenshotPath);
    const base64 = imageBuffer.toString("base64");

    const response: DCGenResultImageResponse = { image: base64 };
    res.json(response);
  } catch (err) {
    res.status(502).json({
      message: "Failed to fetch result image",
      error: String(err),
    });
  }
};

/**
 * Reads the generated HTML from the DCGen results directory.
 * GET /api/dcgen/result-html/:runId/:instanceId
 */
export const handleDCGenResultHtml: RequestHandler = async (req, res) => {
  try {
    const { runId, instanceId } = req.params;
    const fs = await import("fs");
    const path = await import("path");

    const { status, data } = await proxyToDCGen("/get-report", "POST", {
      run_id: runId,
    });

    if (status !== 200) {
      res.status(status).json(data);
      return;
    }

    const report = (data as DCGenReportResponse).report;
    const outputDir = (report.results as unknown as { output_dir?: string })
      ?.output_dir;

    if (!outputDir) {
      res.status(404).json({ message: "Output directory not found" });
      return;
    }

    const htmlPath = path.join(outputDir, `${instanceId}.html`);
    if (!fs.existsSync(htmlPath)) {
      res.status(404).json({ message: "HTML file not found" });
      return;
    }

    const html = fs.readFileSync(htmlPath, "utf-8");
    const response: DCGenResultHtmlResponse = { html };
    res.json(response);
  } catch (err) {
    res.status(502).json({
      message: "Failed to fetch result HTML",
      error: String(err),
    });
  }
};
