# Kleanex — fresh produce export website

Static three-page marketing site for **Kleanex (Pty) Ltd t/a Procitru**, an exporter of fresh
produce from Zimbabwe and South Africa (blueberries, strawberries, litchis, kiwis, passion
fruit, avocados).

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — positioning, produce overview, export process, season calendar, markets |
| `about.html` | About us — company profile, full produce-line specifications, quality & compliance |
| `contact.html` | Contact us — enquiry form, office details, grower enquiries |

## Stack

Plain HTML, one CSS file, one JS file. No build step, no dependencies, no framework.

```
index.html / about.html / contact.html
css/styles.css      design tokens + components
js/site.js          mobile nav, footer year, enquiry form
assets/favicon.svg
robots.txt, sitemap.xml, .nojekyll
```

Fruit and UI icons are inline SVG sprites defined at the top of each page — no image files to
load, and they stay sharp at any size.

## Local preview

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Deployment

Hosted on GitHub Pages from the `main` branch root.
Pushing to `main` republishes the site within a minute or two.

### Custom domain (kleanex.co.za)

Not yet enabled. To switch the site from the `github.io` URL to the real domain:

1. At the DNS host for `kleanex.co.za`, add four `A` records for the apex pointing to
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`,
   and a `CNAME` for `www` pointing to `tmariga85.github.io`.
2. In the repository, **Settings → Pages → Custom domain**, enter `kleanex.co.za` and save
   (this creates a `CNAME` file in the repo).
3. Once DNS resolves, tick **Enforce HTTPS**.

Do step 1 before step 2 — setting the custom domain first takes the site off the `github.io`
address while DNS is still unresolved.

## Content to confirm

- **`info@kleanex.co.za`** is used throughout (top bar, footer, enquiry form, schema). The
  mailbox needs to exist on the domain, or swap it for a working address — it appears in
  `index.html`, `about.html`, `contact.html` and `js/site.js`.
- Season windows in the calendar are indicative for Southern African production and should be
  checked against each year's actual harvest before buyers plan against them.
- Varieties and pack formats per line are standard offerings — adjust in `about.html` if the
  real programme differs.
- Product photography would lift the site considerably; the layout has room for a hero image
  and per-line photos whenever shots are available.

## Enquiry form

The contact form composes a pre-filled email in the visitor's own mail client (`mailto:`) —
static hosting has no server to receive a POST. To collect submissions without relying on the
visitor's mail program, point the form at a form service (Formspree, Netlify Forms, Google
Forms) and replace the submit handler in `js/site.js`.
