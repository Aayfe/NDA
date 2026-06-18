# REVEL Robotics — NDA (e-sign + PDF export + auto-email)

A bilingual (EN/CZ) Non-Disclosure Agreement that the recipient can fill in, sign on
screen, and export to a clean 2-page PDF. On export the PDF is also emailed — **to the
address the signer entered**, with a copy to the company — via a small serverless
function, so **no secret keys live in the frontend**.

- **`index.html`** — the live signing page.
- **`netlify/functions/send-nda.js`** — serverless function that emails the PDF via
  **Gmail SMTP** (free, using a Gmail App Password — no paid service, no domain setup).
- **`package.json`** — declares the one dependency (`nodemailer`); Netlify installs it
  automatically on deploy.
- **`netlify.toml`** — Netlify config (static root + functions dir).
- **`zalohy/`** — timestamped backups of previous `index.html` versions.
- The PDF is generated in the browser with [jsPDF](https://github.com/parallax/jsPDF),
  embedding **PT Serif** (Czech diacritics) and **Great Vibes** (the company signature).

## Deploy on Netlify

Netlify serves the static page **and** runs the serverless function (GitHub Pages
can't run functions, which is why we use Netlify). Your code can still live in GitHub.

1. Push this folder to a GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "REVEL NDA signing page + Gmail email function"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. Go to <https://app.netlify.com> → **Add new site → Import an existing project** →
   pick your GitHub repo. Leave the build command empty, publish directory `.` (the
   `netlify.toml` already sets this). Netlify auto-installs `nodemailer`. Deploy.
3. Your site is live at `https://<your-site>.netlify.app`.

## Set up Gmail sending — free, no domain required

The function logs into a Gmail account with an **App Password** (a 16-char code that is
*not* your normal password). This needs 2-Step Verification turned on.

1. On the Gmail account (e.g. `info@revelrobotics.com` if it's a Google Workspace/Gmail
   account, or any `@gmail.com`), enable **2-Step Verification**:
   <https://myaccount.google.com/security>.
2. Create an App Password: <https://myaccount.google.com/apppasswords> → app "Mail",
   any device name → Google shows a **16-character password**. Copy it (remove spaces).
3. In **Netlify → Site configuration → Environment variables**, add:

   | Key | Value |
   |-----|-------|
   | `GMAIL_USER` | the sending Gmail address, e.g. `you@gmail.com` |
   | `GMAIL_APP_PASSWORD` | the 16-char App Password (no spaces) |
   | `COMPANY_COPY_EMAIL` *(optional)* | leave unset for **no copy** (email goes only to the signer); set an address to CC the company |
   | `MAIL_FROM` *(optional)* | `REVEL NDA <you@gmail.com>` (sender shown to recipient) |

4. **Redeploy** the site (Netlify → Deploys → Trigger deploy) so the env vars load.

That's it. On export: the PDF downloads → it's emailed to the signer's address with a
copy to `COMPANY_COPY_EMAIL` → a green/red toast confirms whether the email sent.

> **Gmail limits:** a normal Gmail account sends up to ~500 emails/day, Google
> Workspace ~2,000/day — far more than enough for NDAs. Gmail can send to **any**
> recipient, so the signer gets their copy directly (no domain verification needed).

## Turning email off

In `index.html`, set `var EMAIL_ENABLED = false;` to make export download-only (no
server call). Re-enable by setting it back to `true`.

## Notes

- **Internet is required** to export (jsPDF + fonts load from a CDN; the email goes
  through the function). The form itself otherwise works offline.
- The PDF embeds full fonts, so it's ~1–2 MB — well within Gmail's 25 MB attachment limit.
- The legal text is a clean template drafted to match the document structure — have it
  reviewed before relying on it for actual agreements.
- `nda.html` is an older Resend-based copy kept for reference; `index.html` is the live
  page. Delete `nda.html` if you don't need it.
