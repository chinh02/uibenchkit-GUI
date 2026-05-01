type Env = {
  WEBBENCH_PROXY_URL?: string;
  WEBBENCH_PROXY_SECRET?: string;
};

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "host",
]);

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function copyRequestHeaders(headers: Headers): Headers {
  const next = new Headers();
  headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      next.set(key, value);
    }
  });
  return next;
}

function copyResponseHeaders(headers: Headers): Headers {
  const next = new Headers();
  headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      next.set(key, value);
    }
  });
  return next;
}

export const onRequest = async ({
  request,
  env,
}: {
  request: Request;
  env: Env;
}) => {
  if (!env.WEBBENCH_PROXY_URL) {
    return jsonResponse(
      {
        error: "WebBench proxy not configured",
        message: "Set WEBBENCH_PROXY_URL in Cloudflare Pages variables.",
      },
      500,
    );
  }

  const sourceUrl = new URL(request.url);
  const upstreamBase = env.WEBBENCH_PROXY_URL.replace(/\/+$/, "");
  const upstreamUrl = new URL(`${upstreamBase}${sourceUrl.pathname}`);
  upstreamUrl.search = sourceUrl.search;

  const upstreamResponse = await fetch(upstreamUrl.toString(), {
    method: request.method,
    headers: (() => {
      const headers = copyRequestHeaders(request.headers);
      if (env.WEBBENCH_PROXY_SECRET) {
        headers.set("x-webbench-proxy-secret", env.WEBBENCH_PROXY_SECRET);
      }
      return headers;
    })(),
    body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
  });

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: copyResponseHeaders(upstreamResponse.headers),
  });
};
