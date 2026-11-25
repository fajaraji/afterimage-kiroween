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

A field instruction sits above the cemetery map on arrival. The four-stage itinerary marks the current step and explains what the next button does. One action beneath the map advances the entire case.

1. **Erase primary record** removes the active record and leaves its finding pending.
2. **Scan all locations** checks the four stores. The primary reads clear and three copies survive. A dashed path marks a possible restore from the backup.
3. **Restore from backup** imports the snapshot and reads the primary again. A confirmed read brings a veiled apparition forward from the primary grave, accompanied by a recorded ghost voice. The scene withdraws into the grave and leaves a marked return route. Reduced motion displays a still portrait and a return imprint.
4. **View certificate** opens the latest findings and the primary readings on either side of the last import. **Print / save PDF** exports that evidence. The case update number counts changes to case evidence.

Select a location to read its evidence or to erase and recheck an individual copy. These optional actions are in its evidence panel. Use **Map tools** to expand the scene, show paths, or replay the last action. After a confirmed return, **Replay the return** plays the apparition again, including after a reload. Replay preserves the evidence. Reduced-motion mode shows the result immediately. **Reset case** starts a new investigation. Reloading keeps the current case in this tab.

The default **Demo workspace** runs entirely in the browser. AWS service names describe the intended backend. The team is using Codex for the frontend and plans to implement the backend with Kiro. Add genuine Kiro work to the root `.kiro/` directory as the backend is developed.

## Connect the backend

The backend handoff includes the AWS mapping, integration steps, acceptance scenarios and ideas for the team to evaluate. [Backend handoff in Bahasa Indonesia](docs/backend-handoff.md)

Set `NEXT_PUBLIC_AFTERIMAGE_API_BASE` to the HTTPS API origin and optional path prefix before building the frontend. For example, `https://api.example.org/v1`. The same interface switches to **Connected workspace** and consumes the server's evidence snapshots. The API origin and frontend origin may differ. See [the integration contract](docs/backend-contract.md).

## Project tickets

Track implementation and verification in the [GitHub issues](https://github.com/fajaraji/afterimage-kiroween/issues?q=is%3Aissue).

## Assets and license

The Costume Contest turns erasure verification into a Halloween shadow theatre. The cemetery, harvest moon, gates, jack-o’-lanterns and hooded apparitions are drawn in Canvas. Reading a store reveals the evidence. The skull crypt opens during backup restoration and the destination grave splits only on a confirmed return. The four locations rearrange on small screens. The local score mixes chapel bells, a filing drawer, paper, a stone door and a recorded ghost voice. The score ducks to near silence between the hinge and the apparition. The original CC0 recordings are by qubodup and laleksic. [Recording credits](public/licenses/Cemetery-audio.txt) The ambience starts on arrival when the browser permits autoplay, or on the first ordinary interaction. The sound control remembers an explicit mute. DM Sans and Germania One are bundled locally under the SIL Open Font License. Lucide supplies interface icons. Their license notices are in [public/licenses](public/licenses). The project source is available under [MIT](LICENSE).
