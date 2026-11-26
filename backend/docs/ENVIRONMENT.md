> **AWS-first note:** `npm run dev` is local-only. AWS deployment is not implemented. See docs/AWS-DEPLOYMENT.md.

# Setup, environment, and troubleshooting

- Node >=22.13.0 and npm; local terminal plus Kiro IDE (recommended).
- Run `npm install` **online**. This ZIP intentionally omits `node_modules` and `package-lock.json` because package-registry access was unavailable during generation. After `npm install`, **commit the generated lockfile**. CI supports a first `npm install` bootstrap and uses `npm ci` after you commit the lockfile.
- Run `npm run dev` to start Vite (5173) and Fastify (8787) bound to 127.0.0.1.
- The frontend shows an honest implementation map and API health; core product not yet implemented.
- If port 8787 or 5173 is busy, stop other dev processes; keep proxy and backend port in sync if changed.
- Build errors after npm install: capture exact logs, check `node --version`, do not silently downgrade strict compiler settings.
- Windows: use PowerShell/CMD in Kiro; npm workspace scripts are cross-platform. If node process cleanup leaves child processes after Ctrl+C, stop them manually.
- Kiro Web: push repo to GitHub before connecting; local hooks are IDE/CLI only.
- If npm install can't access the network, work on specs and architecture first; do not claim TypeScript tests/build passed.
