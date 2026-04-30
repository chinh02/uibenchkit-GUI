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

`public/_redirects` rewrites all routes to `index.html`, so React Router pages work when visitors refresh a nested URL.

## Live Demo note

Cloudflare Pages will only serve the static frontend. The current Live Demo calls `/api/dcgen/...`, which requires the Express proxy or another backend. If the Google VM is turned off, hide or remove the Live Demo before deploying the public static site.
