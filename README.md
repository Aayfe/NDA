# REVEL Robotics — NDA (e-sign + PDF export)

A single-file, bilingual (EN/CZ) Non-Disclosure Agreement that the recipient can
fill in, sign on screen, and export to a clean 2-page PDF — all client-side, no backend.

- **`index.html`** — the page served by GitHub Pages (identical to `nda.html`).
- Signature is captured on a canvas; the PDF is generated in the browser with
  [jsPDF](https://github.com/parallax/jsPDF) and an embedded PT Serif font so Czech
  diacritics render correctly.

## Deploy to GitHub Pages

1. Create a repo and push these files (at minimum `index.html` and `.nojekyll`):
   ```bash
   git init
   git add index.html nda.html .nojekyll README.md
   git commit -m "Add REVEL NDA signing page"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages → Build and deployment**
   - **Source:** *Deploy from a branch*
   - **Branch:** `main` / `/ (root)` → **Save**
3. Wait ~1 minute. Your page is live at:
   `https://<you>.github.io/<repo>/`

## Notes

- **Internet is required** the first time a PDF is exported (the font and the jsPDF
  library load from a CDN). The page itself otherwise works offline.
- The legal text is a clean template drafted to match the document structure — have
  it reviewed before relying on it for actual agreements.
