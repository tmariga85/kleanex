# Kleanex — Fresh Produce. Global Reach.

Static three-page marketing site for **Kleanex (Pty) Ltd t/a Procitru**, an exporter of fresh
produce from Zimbabwe and South Africa (blueberries, strawberries, litchis, kiwis, passion
fruit, avocados).

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero carousel, products, export capabilities, quality, sustainability, enquiry form |
| `about.html` | About us — company profile, full produce-line specs, season calendar, compliance, values |
| `contact.html` | Contact us — full enquiry form, office details, grower enquiries |

## Stack

Plain HTML, one CSS file, one JS file. No build step, no dependencies, no framework.

```
index.html / about.html / contact.html
css/styles.css      design tokens + components
js/site.js          mobile nav, hero carousel, enquiry form
assets/favicon.svg
assets/img/         photography (see assets/img/README.md)
robots.txt, sitemap.xml, .nojekyll
```

Brand: Poppins for headings (two-tone — dark navy line, green line), Inter for body, the
graduated dot-ring logo mark, vivid green `#22a94a` with navy `#0f2b40`. The logo, decorative
bubbles, fruit illustrations and all UI icons are inline SVG — no image files required.

## Photography

The design is built for photographs. Drop JPGs into `assets/img/` using the filenames listed
in [assets/img/README.md](assets/img/README.md) and they appear automatically — each photo
slot falls back to a green gradient panel with a fruit illustration until the file exists, so
a missing image never shows a broken icon.

## Local preview

Open `index.html` in a browser, or serve the folder:

```bash
npx http-server . -p 4322 -c-1
```

## Deployment

Hosted on GitHub Pages from the `main` branch root — pushing to `main` republishes within a
minute or two.

- Live now: https://tmariga85.github.io/kleanex/
- Target: https://www.kleanex.co.za/ (all canonical URLs, Open Graph tags and the sitemap
  already point here)

### Moving to www.kleanex.co.za

The domain is registered with Afrihost and currently shows an Afrihost "Domain Parked" page.
Mail is on Google Workspace, and **nothing below touches mail** — leave the `MX` and `TXT`
records exactly as they are.

**Step 1 — change DNS at Afrihost** (My Account → Domains → kleanex.co.za → DNS / zone editor).

Delete the two records pointing at the Afrihost web server `102.222.124.102`:

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `102.222.124.102` ← delete |
| A | `www` | `102.222.124.102` ← delete |

Add these:

| Type | Host | Value |
| --- | --- | --- |
| CNAME | `www` | `tmariga85.github.io` |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

The four A records make the bare `kleanex.co.za` redirect to `www`.

**Step 2 — set the custom domain on GitHub.** Repository → Settings → Pages → Custom domain →
`www.kleanex.co.za` → Save. This writes a `CNAME` file into the repo. Once the DNS check
passes, tick **Enforce HTTPS** (the certificate is free and automatic; it can take up to an
hour to appear).

Do step 1 first. Setting the custom domain before DNS resolves takes the site off the
`github.io` address while the domain is still pointing at Afrihost.

**Cancelling Afrihost hosting:** keep the *domain registration* and DNS zone with Afrihost —
only the web hosting package is no longer needed. If the whole account lapses, the domain
stops resolving and the site and the Google Workspace mail both go down with it.

## Content to confirm

- **`info@kleanex.co.za`** is used throughout (footer, forms, schema, `js/site.js`). Mail runs
  on Google Workspace, so this address needs to exist there — or swap it for a working one.
- Season windows are indicative for Southern African production; check each year's harvest
  before buyers plan against them.
- Varieties and pack formats per line are standard offerings — adjust in `about.html` if the
  real programme differs.
- Social profile links are not in the footer yet (no accounts); phone, WhatsApp and email are
  there instead. Add social icons to `.footer-contacts` when the profiles exist.
- There is no Privacy Policy or Terms page yet, so the footer does not link to them.

## Enquiry form

Both forms compose a pre-filled email in the visitor's own mail client (`mailto:`) — static
hosting has no server to receive a POST. To collect submissions without relying on the
visitor's mail program, point the form at a form service (Formspree, Netlify Forms) and
replace the submit handler in `js/site.js`.
