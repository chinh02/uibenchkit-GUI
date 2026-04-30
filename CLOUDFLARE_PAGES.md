# Cloudflare Pages Deployment

This project is configured for a static Cloudflare Pages deployment.

## Cloudflare dashboard settings

- Root directory: `test-builder-vibe-coding`
- Build command: `pnpm build:client`
- Build output directory: `dist/spa`
- Node version: `22`

Cloudflare Pages Git deployments do not need a deploy command. If the dashboard asks for a deploy command, you are likely configuring a Worker build rather than a Pages project.

The `wrangler.toml` file also declares `pages_build_output_dir = "./dist/spa"`.

## Deploy from GitHub

1. Push this repository to GitHub.
2. In Cloudflare, open **Workers & Pages**.
3. Create a Pages project and connect the GitHub repository.
4. Use the dashboard settings above.
5. Deploy.

## Routing

Cloudflare Pages' default SPA behavior serves `index.html` for client-side routes. `public/_routes.json` restricts Functions to API routes.

## GitHub leaderboard proxy

The leaderboard uses a Cloudflare Pages Function at `/.netlify/functions/github-proxy` to read private GitHub files without exposing the token in browser code.

Set these Cloudflare Pages variables:

- `GITHUB_TOKEN`: GitHub token with read access to the leaderboard repository. Store this as a secret.
- `GITHUB_REPO`: `chinh02/web-bench-experiments`
- `GITHUB_BRANCH`: `main`

## Live Demo WebBench proxy

The Live Demo calls `/api/dcgen/*`. In production, Cloudflare Pages forwards those requests to the Node/Express proxy running beside the WebBench Flask API on the Google VM.

Set this Cloudflare Pages variable:

- `WEBBENCH_PROXY_URL`: public URL for the VM Node proxy, for example `https://webbench-api.example.com`
- `WEBBENCH_PROXY_SECRET`: shared secret sent by Cloudflare Pages to the VM proxy. Store this as a secret.

On the VM, run the frontend server/proxy with:

```bash
cd /path/to/test-builder-vibe-coding
pnpm install --frozen-lockfile
pnpm build
WEBBENCH_API_URL=http://127.0.0.1:5000 WEBBENCH_PROXY_SECRET=your_shared_secret PORT=3000 node dist/server/node-build.mjs
```

Expose `http://127.0.0.1:3000` publicly with Cloudflare Tunnel or another HTTPS reverse proxy. The Cloudflare Pages Function keeps the browser calling same-origin `/api/dcgen/*`.

## Live Demo note

Cloudflare Pages will only serve the static frontend. The current Live Demo calls `/api/dcgen/...`, which requires the Express proxy or another backend. If the Google VM is turned off, hide or remove the Live Demo before deploying the public static site.
