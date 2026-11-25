# Afterimage

[Open the visual demo on Vercel](https://afterimage-kiroween.vercel.app/)

Afterimage follows one fictional erasure request through a primary database, an analytics replica, a file export and a backup snapshot. Surviving copies appear as ghosts on an illustrated cemetery map. A read that confirms absence places a headstone. Restoring a retained snapshot reveals which record returned and why.

## Run the frontend

Use Node.js 22.13 or newer and npm.

```sh
npm ci
npm run dev
```

Open the local address printed by Next.js. Run `npm test` for the evidence-state tests, `npm run typecheck` for TypeScript, and `npm run build` for a production static export in `out/`. Vercel can deploy the project from the repository root. Any static host, including Cloudflare Pages, can serve the exported directory.

## Try the case

1. Choose **Erase primary record**, then **Scan all locations**. The primary database becomes verified clear. Three copies survive.
2. Follow **Next action** to erase and recheck the analytics replica and the export. You can also select any location on the map or in the ledger.
3. Leave the backup intact and choose **Restore snapshot**. The restoration and the confirming read appear in the event log. The primary location shows its backup source.
4. Open **Certificate** and select **Print / save PDF** to export a point-in-time report. You can issue a report before finishing, including unverified locations.
5. Use **Reset case** to start over. Browser sessions use fictional data held in session storage. Reloading the page retains the current case.

The default **Demo workspace** runs entirely in the browser. AWS service names describe the intended backend. The team is using Codex for the frontend and plans to implement the backend with Kiro. Add genuine Kiro work to the root `.kiro/` directory as the backend is developed.

## Connect the backend

Set `NEXT_PUBLIC_AFTERIMAGE_API_BASE` to the HTTPS API origin and optional path prefix before building the frontend. For example, `https://api.example.org/v1`. The same interface switches to **Connected workspace** and consumes the server's evidence snapshots. The API origin and frontend origin may differ. See [the integration contract](docs/backend-contract.md).

## Project tickets

Track implementation and verification in the [GitHub issues](https://github.com/fajaraji/afterimage-kiroween/issues?q=is%3Aissue).

## Assets and license

The original graveyard artwork was generated for this project with OpenAI ImageGen. Ambient sound and interaction chimes are synthesized in the browser and start muted. DM Sans and Instrument Serif are bundled locally under the SIL Open Font License. Lucide supplies interface icons. Their license notices are in [public/licenses](public/licenses). The project source is available under [MIT](LICENSE).
