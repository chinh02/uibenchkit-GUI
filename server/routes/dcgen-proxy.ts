/**
 * WebBench API Proxy
 *
 * Proxies requests from the frontend to the WebBench Flask API server.
 * This keeps the WebBench API URL and API key on the server side.
 *
 * Environment variables:
 *   DCGEN_API_URL  - Base URL of the WebBench Flask server (default: http://localhost:5000)
 *   DCGEN_API_KEY  - API key for authenticating with WebBench
 */
import { RequestHandler } from "express";
import type {
  DCGenSubmitResponse,
  DCGenPollResponse,
  DCGenReportResponse,
  DCGenHealthResponse,
  DCGenResultImageResponse,
  DCGenResultHtmlResponse,
  DCGenStopRunResponse,
} from "@shared/api";

const DCGEN_API_URL =
  process.env.DCGEN_API_URL || "http://localhost:5000";
const DCGEN_API_KEY = process.env.DCGEN_API_KEY || "dev-api-key-12345";

/** Helper: proxy a JSON request to WebBench */
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

function getFilenameFromContentDisposition(
  contentDisposition: string | null,
  fallback: string
): string {
  if (!contentDisposition) return fallback;

  // Prefer RFC 5987 filename*= for UTF-8 names.
  const utf8Match = contentDisposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1].trim().replace(/["']/g, ""));
    } catch {
      return utf8Match[1].trim().replace(/["']/g, "");
    }
  }

  const plainMatch = contentDisposition.match(/filename\s*=\s*("?)([^";]+)\1/i);
  if (plainMatch?.[2]) {
    return plainMatch[2].trim();
  }

  return fallback;
}

// â”€â”€â”€ Health â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const handleDCGenHealth: RequestHandler = async (_req, res) => {
  try {
    const { status, data } = await proxyToDCGen("/health", "GET");
    res.status(status).json(data);
  } catch (err) {
    res.status(502).json({
      message: "Cannot reach WebBench API server",
      error: String(err),
    });
  }
};

// â”€â”€â”€ Submit â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const handleDCGenSubmit: RequestHandler = async (req, res) => {
  try {
    const { status, data } = await proxyToDCGen("/submit", "POST", req.body);
    res.status(status).json(data as DCGenSubmitResponse);
  } catch (err) {
    res.status(502).json({
      message: "Cannot reach WebBench API server",
      error: String(err),
    });
  }
};

// â”€â”€â”€ Upload image and submit â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
/**
 * Accepts a JSON body with:
 *   - image: base64-encoded PNG/JPG
 *   - model: model name (e.g. "gemini", "claude")
 *   - method: method name (e.g. "dcgen", "direct")
 *   - reference_html: (optional) ground-truth HTML source code.
 *       When provided, it is saved as `input.html` in the temp input
 *       directory so that WebBench evaluation can compute code similarity
 *       and fine-grained metrics against the reference.
 *
 * Saves the image to a temp directory and calls /submit on the WebBench API.
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
    // so that WebBench can find it as the reference during evaluation.
    if (reference_html && reference_html.trim()) {
      const refHtmlPath = path.join(tmpDir, "input.html");
      fs.writeFileSync(refHtmlPath, reference_html, "utf-8");
    }

    // Submit to WebBench with the temp directory as input_dir
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
      message: "Failed to upload and submit to WebBench",
      error: String(err),
    });
  }
};

// â”€â”€â”€ Poll â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
      message: "Cannot reach WebBench API server",
      error: String(err),
    });
  }
};

// â”€â”€â”€ Report â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
      message: "Cannot reach WebBench API server",
      error: String(err),
    });
  }
};

// â”€â”€â”€ Stop run â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const handleDCGenStopRun: RequestHandler = async (req, res) => {
  try {
    const { run_id } = req.body as { run_id?: string };
    if (!run_id) {
      res.status(400).json({ message: "run_id is required" });
      return;
    }

    const { status, data } = await proxyToDCGen("/stop-run", "POST", {
      run_id,
      run_evaluation: false,
    });
    res.status(status).json(data as DCGenStopRunResponse);
  } catch (err) {
    res.status(502).json({
      message: "Cannot reach WebBench API server",
      error: String(err),
    });
  }
};

// â”€â”€â”€ Upload folder and submit â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
/**
 * Accepts a JSON body with:
 *   - files: Array<{ path: string; content: string; type: "image"|"html"|"css"|"other" }>
 *       Each file has its relative path and base64-encoded content.
 *   - model: model name
 *   - method: method name
 *
 * Writes all files to a temp directory:
 *   - Images are saved as .png (WebBench scans for *.png)
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

    // Submit to WebBench
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
      message: "Failed to upload folder and submit to WebBench",
      error: String(err),
    });
  }
};

// â”€â”€â”€ List models from external providers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
/**
 * Fetches available models from a provider's API.
 * POST /api/dcgen/list-models
 * Body: { provider: "openai" | "claude" | "gemini" | "openkey", api_key: string, base_url?: string }
 */
export const handleDCGenListModels: RequestHandler = async (req, res) => {
  try {
    const { provider, api_key, base_url } = req.body as {
      provider: string;
      api_key: string;
      base_url?: string;
    };

    if (!api_key) {
      res.status(400).json({ message: "API key is required" });
      return;
    }

    let models: string[] = [];

    if (provider === "openai") {
      const resp = await fetch("https://api.openai.com/v1/models", {
        headers: { Authorization: `Bearer ${api_key}` },
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        res.status(resp.status).json({ message: (err as Record<string, unknown>).error || "Failed to fetch OpenAI models" });
        return;
      }
      const data = (await resp.json()) as { data: { id: string }[] };
      models = data.data
        .map((m) => m.id)
        .filter((id) =>
          /^(gpt-|o[134]-|o[134]$|chatgpt-)/.test(id)
        )
        .sort();
    } else if (provider === "claude") {
      const resp = await fetch("https://api.anthropic.com/v1/models", {
        headers: {
          "x-api-key": api_key,
          "anthropic-version": "2023-06-01",
        },
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        res.status(resp.status).json({ message: (err as Record<string, unknown>).error || "Failed to fetch Claude models" });
        return;
      }
      const data = (await resp.json()) as { data: { id: string }[] };
      models = data.data.map((m) => m.id).sort();
    } else if (provider === "gemini") {
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(api_key)}`
      );
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        res.status(resp.status).json({ message: (err as Record<string, unknown>).error || "Failed to fetch Gemini models" });
        return;
      }
      const data = (await resp.json()) as {
        models: { name: string; supportedGenerationMethods?: string[] }[];
      };
      models = data.models
        .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
        .map((m) => m.name.replace(/^models\//, ""))
        .sort();
    } else if (provider === "openkey") {
      const endpoint = base_url?.replace(/\/+$/, "") || "https://openkey.cloud/v1";
      const resp = await fetch(`${endpoint}/models`, {
        headers: { Authorization: `Bearer ${api_key}` },
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        res.status(resp.status).json({ message: (err as Record<string, unknown>).error || "Failed to fetch models" });
        return;
      }
      const data = (await resp.json()) as { data: { id: string }[] };
      models = data.data.map((m) => m.id).sort();
    } else {
      res.status(400).json({ message: `Unknown provider: ${provider}` });
      return;
    }

    res.json({ models });
  } catch (err) {
    res.status(502).json({
      message: "Failed to fetch models from provider",
      error: String(err),
    });
  }
};

// â”€â”€â”€ Result files (image / HTML) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
/**
 * Reads the generated screenshot PNG from the WebBench results directory.
 * GET /api/dcgen/result-image/:runId/:instanceId
 */
export const handleDCGenResultImage: RequestHandler = async (req, res) => {
  try {
    const { runId, instanceId } = req.params;
    const fs = await import("fs");
    const path = await import("path");

    // WebBench stores results at: <results>/<runId>/<instanceId>.png
    // We ask the WebBench API for the report to get the output_dir
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
 * Reads the generated HTML from the WebBench results directory.
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

/**
 * Downloads all run artifacts as a ZIP file from the WebBench backend.
 * GET /api/dcgen/download-artifacts/:runId
 */
export const handleDCGenDownloadArtifacts: RequestHandler = async (req, res) => {
  try {
    const { runId } = req.params;
    if (!runId) {
      res.status(400).json({ message: "runId is required" });
      return;
    }

    const qs = `run_id=${encodeURIComponent(runId)}`;
    const upstreamResp = await fetch(`${DCGEN_API_URL}/download-artifacts?${qs}`, {
      method: "GET",
      headers: {
        "x-api-key": DCGEN_API_KEY,
      },
    });

    if (!upstreamResp.ok) {
      const contentType = upstreamResp.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const errorData = await upstreamResp.json().catch(() => ({}));
        res.status(upstreamResp.status).json(errorData);
      } else {
        const errorText = await upstreamResp.text().catch(() => "");
        res.status(upstreamResp.status).json({
          message: "Failed to download artifacts from WebBench",
          error: errorText || upstreamResp.statusText,
        });
      }
      return;
    }

    const contentDisposition = upstreamResp.headers.get("content-disposition");
    const filename = getFilenameFromContentDisposition(
      contentDisposition,
      `${runId}_artifacts.zip`
    );

    const arrayBuffer = await upstreamResp.arrayBuffer();
    const zipBuffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(zipBuffer);
  } catch (err) {
    res.status(502).json({
      message: "Failed to download artifacts",
      error: String(err),
    });
  }
};

