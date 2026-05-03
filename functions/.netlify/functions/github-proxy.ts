type Env = {
  GITHUB_TOKEN?: string;
  GITHUB_REPO?: string;
  GITHUB_BRANCH?: string;
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export const onRequestGet = async ({
  request,
  env,
}: {
  request: Request;
  env: Env;
}) => {
  const githubToken = env.GITHUB_TOKEN;
  const githubRepo = env.GITHUB_REPO;
  const defaultBranch = env.GITHUB_BRANCH || "main";

  if (!githubToken) {
    return jsonResponse(
      {
        error: "GitHub token not configured",
        message: "Please set GITHUB_TOKEN in Cloudflare Pages variables.",
      },
      500,
    );
  }

  if (!githubRepo) {
    return jsonResponse(
      {
        error: "GitHub repository not configured",
        message: "Please set GITHUB_REPO in Cloudflare Pages variables.",
      },
      500,
    );
  }

  const url = new URL(request.url);
  const filePath = url.searchParams.get("filePath");
  const branch = url.searchParams.get("branch") || defaultBranch;

  if (!filePath) {
    return jsonResponse({ error: "filePath parameter is required" }, 400);
  }

  const apiUrl = `https://api.github.com/repos/${githubRepo}/contents/${filePath}?ref=${encodeURIComponent(branch)}`;
  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${githubToken}`,
      Accept: "application/vnd.github.v3.raw",
      "User-Agent": "UIBenchKit-Leaderboard",
    },
  });

  if (!response.ok) {
    return jsonResponse(
      {
        error: `GitHub API error: ${response.status}`,
        message:
          response.status === 404
            ? "File not found in repository"
            : "Failed to fetch from GitHub",
      },
      response.status,
    );
  }

  const body = await response.text();
  const contentType = filePath.endsWith(".csv")
    ? "text/csv; charset=utf-8"
    : filePath.endsWith(".json")
      ? "application/json; charset=utf-8"
      : "text/plain; charset=utf-8";

  return new Response(body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=300",
    },
  });
};
