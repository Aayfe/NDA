# REVEL Robotics — NDA (e-sign + PDF export + auto-email)

A bilingual (EN/CZ) Non-Disclosure Agreement that the recipient can fill in, sign on
screen, and export to a clean 2-page PDF. On export the PDF is also emailed (the signed
copy to the recipient as CC, the main copy to the company) via a small serverless
function so **no secret keys live in the frontend**.

- **`index.html`** — the signing page (identical to `nda.html`).
- **`netlify/functions/send-nda.js`** — serverless function that emails the PDF via
  [Resend](https://resend.com). Zero npm dependencies (uses built-in `fetch`).
- **`netlify.toml`** — Netlify config (static root + functions dir).
- The PDF is generated in the browser with [jsPDF](https://github.com/parallax/jsPDF),
  embedding **PT Serif** (Czech diacritics) and **Great Vibes** (the company signature).

## Deploy on Netlify

Netlify serves the static page **and** runs the serverless function (GitHub Pages
can't run functions, which is why we use Netlify). Your code can still live in GitHub.

1. Push this folder to a GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "REVEL NDA signing page + email function"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. Go to <https://app.netlify.com> → **Add new site → Import an existing project** →
   pick your GitHub repo. Leave build command empty, publish directory `.` (the
   `netlify.toml` already sets this). Deploy.
3. Your site is live at `https://<your-site>.netlify.app`.

## Set up Resend (the email sender)

1. Create a free account at <https://resend.com> (free tier: ~3,000 emails/month).
2. **API Keys → Create API Key** → copy it (starts with `re_`).
3. **Domains → Add Domain** → add `revelrobotics.com` and follow the DNS steps so you
   can send from your own domain (e.g. `nda@revelrobotics.com`).
   - *Without a verified domain* Resend only lets you send from `onboarding@resend.dev`
     and only to your own account email — fine for testing, not for real recipients.
4. In **Netlify → Site configuration → Environment variables**, add:

   | Key | Value |
   |-----|-------|
   | `RESEND_API_KEY` | your `re_...` key |
   | `MAIL_FROM` | `REVEL NDA <nda@revelrobotics.com>` (a verified sender) |
   | `COMPANY_COPY_EMAIL` | `info@revelrobotics.com` |

5. **Redeploy** the site (Netlify → Deploys → Trigger deploy) so the env vars load.

That's it. On export: PDF downloads → it's emailed to `info@revelrobotics.com` with the
recipient CC'd → a green/red toast confirms whether the email sent.

## Turning email off

In `index.html`, set `var EMAIL_ENABLED = false;` to make export download-only (no
server call). Re-enable by setting it back to `true`.

## Notes

- **Internet is required** to export (jsPDF + fonts load from a CDN; the email goes
  through the function). The form itself otherwise works offline.
- The PDF embeds full fonts, so it's ~1–2 MB — well within Resend's attachment limits.
- The legal text is a clean template drafted to match the document structure — have it
  reviewed before relying on it for actual agreements.
- `index.html` and `nda.html` are identical; keep them in sync (or delete `nda.html`
  and keep `index.html` as the single page).
