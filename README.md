# SMRT Lab landing page

The former lab website is now a single silver landing page linking to **https://xbtinchina.github.io/SMRTLab-everything/**. It reuses the current lab logo, silver artwork, typography, and homepage headline. Old sections and downloads are removed from the published site; old bookmarks receive the same landing page through `404.html`.

## Development

Use Node.js 24:

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run check
npm run dev
```

Open the printed local address. Rebuild or restart the development server after source edits.

Application code lives under `website/`; public artwork and its explicit publication manifest live under `public-content/`. The build copies only the manifest's listed files. No internal handbook, source records, or private research material belongs here.

## Deployment

The workflow validates pushes and pull requests. On `main` in `labsmrt/labsmrt.github.io`, it publishes only `dist/` to the existing `gh-pages` branch using the repository's existing `DEPLOY_KEY`. `keep_files: false` removes the old published site from that branch's current tree. The repository's Git history is retained.

GitHub Pages must remain configured to serve the `gh-pages` branch. Deployment requires write access and a valid existing deployment key; those settings are not changed by this source update.

The Inter and Cormorant Garamond fonts retain their OFL license files in `website/assets/fonts/`.
