import { RequestHandler } from "express";

/**
 * Express route to proxy requests to private GitHub repositories
 * This replaces the Netlify function for local development with Vite
 */
export const handleGitHubProxy: RequestHandler = async (req, res) => {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = process.env.GITHUB_REPO;
  const DEFAULT_BRANCH = process.env.GITHUB_BRANCH || "main";

  if (!GITHUB_TOKEN) {
    res.status(500).json({
      error: "GitHub token not configured",
      message: "Please set GITHUB_TOKEN environment variable",
    });
    return;
  }

  if (!GITHUB_REPO) {
    res.status(500).json({
      error: "GitHub repository not configured",
      message: "Please set GITHUB_REPO environment variable",
    });
    return;
  }

  const filePath = req.query.filePath as string;
  const branch = (req.query.branch as string) || DEFAULT_BRANCH;

  if (!filePath) {
    res.status(400).json({ error: "filePath parameter is required" });
    return;
  }

  try {
    // Construct GitHub API URL for raw content
    const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${branch}`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3.raw",
        "User-Agent": "UIBenchKit-Leaderboard",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GitHub API error:", response.status, errorText);

      res.status(response.status).json({
        error: `GitHub API error: ${response.status}`,
        message:
          response.status === 404
            ? "File not found in repository"
            : "Failed to fetch from GitHub",
      });
      return;
    }

    // Check if it's JSON or CSV content
    if (filePath.endsWith(".json")) {
      const data = await response.json();
      res.setHeader("Cache-Control", "public, max-age=300");
      res.json(data);
    } else if (filePath.endsWith(".csv")) {
      const text = await response.text();
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Cache-Control", "public, max-age=300");
      res.send(text);
    } else {
      const text = await response.text();
      res.setHeader("Cache-Control", "public, max-age=300");
      res.send(text);
    }
  } catch (error) {
    console.error("Error fetching from GitHub:", error);
    res.status(500).json({
      error: "Failed to fetch from GitHub",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
