> **Note:** `npm run dev` is local-only. AWS deployment is not implemented. See `.kiro/specs/06-aws-serverless/`.

# Setup, environment, and troubleshooting

- Node >=22.13.0 and npm; local terminal plus Kiro IDE (recommended).
- Run `npm install` **online**. This ZIP intentionally omits `node_modules` and `package-lock.json` because package-registry access was unavailable during generation. After `npm install`, **commit the generated lockfile**. CI supports a first `npm install` bootstrap and uses `npm ci` after you commit the lockfile.
- Run `npm run dev` here to start the Fastify dev shell (8787, bound to 127.0.0.1). The Next.js frontend runs from the repository root (3000).
- The `/cases` API is not built yet; until it is, the frontend runs in its browser demo mode.
- If port 8787 or 3000 is busy, stop other dev processes; keep `API_PORT`, `WEB_ORIGIN` and `NEXT_PUBLIC_AFTERIMAGE_API_BASE` in sync if changed.
- Build errors after npm install: capture exact logs, check `node --version`, do not silently downgrade strict compiler settings.
- Windows: use PowerShell/CMD in Kiro; npm workspace scripts are cross-platform. If node process cleanup leaves child processes after Ctrl+C, stop them manually.
- Kiro Web: push repo to GitHub before connecting; local hooks are IDE/CLI only.
- If npm install can't access the network, work on specs and architecture first; do not claim TypeScript tests/build passed.
