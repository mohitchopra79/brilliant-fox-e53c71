# Travel Pals USA — Website

Static website for Travel Pals (travelpals.us) — bespoke and small-group tours of India.

## Deploying to GitHub Pages

1. Create a new repository (e.g. `travelpals-website`) on GitHub.
2. Upload the contents of this folder to the repo root (drag-and-drop into the GitHub web UI is fine — the `images/` folder must be included).
3. In the repo: **Settings → Pages → Source → Deploy from a branch → `main` / root → Save**.
4. Wait ~1 minute. The site will be live at `https://<your-username>.github.io/<repo-name>/`.

### Custom domain (travelpals.us)
1. In **Settings → Pages → Custom domain**, enter `travelpals.us` and save. A `CNAME` file is created automatically.
2. At your DNS provider, add these records:
   - `A` records on `@` pointing to GitHub's four IPs: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` on `www` pointing to `<your-username>.github.io`
3. Back in **Settings → Pages**, tick **Enforce HTTPS** once DNS propagates.

## File structure

- `index.html` — homepage
- `tours.html` — group tours overview
- `tour-nov-2026.html`, `tour-nov-2026-rail.html`, `tour-feb-2027.html`, `tour-feb-2027-stitching.html` — individual group tours
- `private.html` — private journeys overview
- `private-quintessential.html`, `private-three-kingdoms.html`, `private-north-kerala.html`, `golden-triangle.html`, `exotic-luxury.html` — individual private journeys
- `india.html` — about India
- `about.html` — about Travel Pals
- `booking.html`, `contact.html` — booking & enquiry
- `styles.css` — site styles
- `images/` — all imagery (including `images/extensions/` for tour-extension photos)

## Editing

Open any `.html` file in a text editor. The site uses plain HTML + one CSS file — no build step. Push changes to GitHub and Pages redeploys automatically.
