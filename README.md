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

The first visit opens the illustrated **Field guide**. Choose **Enter with sound** to hear the gate bell and cemetery wind, or **Enter silently**. The header shows whether sound is playing. Reopen **Field guide** at any point for the next case action. On a return visit a saved sound preference activates with the next interaction.

1. Choose **Erase primary record**, then **Scan all locations**. The primary database becomes verified clear. Three copies survive.
2. Follow **Next action** to erase and recheck the analytics replica and the export. You can also select any location on the map or in the ledger.
3. Leave the backup intact and choose **Restore snapshot**. Watch a record travel out of the vault. The ghost rises at its destination once the primary read confirms its return. **Replay** repeats the last scene and its sound in this view without issuing a command or changing the evidence. Reduced-motion mode shows the same findings immediately.
4. Open **Certificate** and select **Print / save PDF** to export a point-in-time report. You can issue a report before finishing, including unverified locations.
5. Use **Reset case** to start over. Browser sessions use fictional data held in session storage. Reloading the page retains the current case.

The default **Demo workspace** runs entirely in the browser. AWS service names describe the intended backend. The team is using Codex for the frontend and plans to implement the backend with Kiro. Add genuine Kiro work to the root `.kiro/` directory as the backend is developed.

## Connect the backend

The backend handoff includes the AWS mapping, integration steps, acceptance scenarios and ideas for the team to evaluate. [Backend handoff in Bahasa Indonesia](docs/backend-handoff.md)

Set `NEXT_PUBLIC_AFTERIMAGE_API_BASE` to the HTTPS API origin and optional path prefix before building the frontend. For example, `https://api.example.org/v1`. The same interface switches to **Connected workspace** and consumes the server's evidence snapshots. The API origin and frontend origin may differ. See [the integration contract](docs/backend-contract.md).

## Project tickets

Track implementation and verification in the [GitHub issues](https://github.com/fajaraji/afterimage-kiroween/issues?q=is%3Aissue).

## Assets and license

The Costume Contest turns erasure verification into a Halloween shadow theatre. The cemetery, harvest moon, gates, jack-o’-lanterns and hooded apparitions are drawn in Canvas. Reading a store reveals the evidence. The skull crypt opens during backup restoration and the destination grave splits only on a confirmed return. The four locations rearrange on small screens. Wind, gate creaks, inspection pulses and the sound of a confirmed return are synthesized in the browser. Audio starts with the visitor’s entry choice. DM Sans and Germania One are bundled locally under the SIL Open Font License. Lucide supplies interface icons. Their license notices are in [public/licenses](public/licenses). The project source is available under [MIT](LICENSE).
