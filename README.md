# ChromeSite Starter — Bootstrap 5

A clean starter template for building a website with the
[ChromeSite](https://github.com/) browser extension. Clone this repo, open
the folder in the extension, and start editing — or fork it as the base for
your own reusable template.

This repo is content + config, not a buildable app. There's no bundler, no
`npm install`, no framework of its own. The only tooling is a small Node
script (`.chromesite/compose.js`) that lets you preview pages headlessly,
matching exactly what the extension's Publish / Render to Local Folder
produces.

> **Read [CLAUDE.md](CLAUDE.md) first if you're using an AI coding
> assistant on this repo.** It documents the conventions below in more
> detail and is written specifically to brief an agent that hasn't seen a
> ChromeSite project before.

## Quick start

1. Clone the repo and open the folder in the ChromeSite extension.
2. Click "Site Settings" in the extension to set your URL and deployment
   settings. You also can edit `.chromesite/site.config.json` manually — 
   set `siteName`, `domain`, and
   confirm `cssFramework` (this starter ships configured for `bootstrap5`).
3. Replace `assets/logo.png` and `assets/logo-footer.png` with your own
   logo, and swap the favicon set in `elements/` if you want your own
   branding there too (see [Favicons](#favicons)).
4. In the ChromeSite Extension, begin editing `index.html` to your own content.
5. Once you have several pages built, click "Edit Menus" to set up your own
   menu structure. You also can update `.chromesite/nav.json` manually.
6. Preview the site in ChromeSite, or deploy locally (see below) to preview 
   directly in your browser. When ready, use the extension to Publish or Render
   to Local Folder when you're ready to ship.

## Previewing locally

Page files in this repo are HTML **fragments**, not full documents (more on
this below), so opening `index.html` directly in a browser won't look
right. Use the compose script instead — it applies the same
template/nav/CSS-framework substitution the extension itself does:

```
node .chromesite/compose.js --out .agent-preview
```

This writes fully-composed pages plus copies of `assets/`, `scripts/`, and
`elements/` into `.agent-preview/`. Serve that folder with any static file
server and open it in a browser. Use a scratch output folder like this
rather than `dist/` (the real deploy output) so you don't clobber a real
build. Run `node .chromesite/compose.js --help` for all options.

## How a ChromeSite project is put together

```
├── index.html ...              ← page content (fragments — see below)
├── 404.html (don't edit)       ← default 404 page needed for Cloudflare and Netlify
├── assets/                     ← images referenced by pages/template
├── elements/                   ← favicons, template backgrounds, shims
├── scripts/
│   ├── styles.css              ← site-wide custom CSS (layered on top
│   │                              of the chosen cssFramework)
│   └── scripts.js              ← site-wide custom JS
├── dist/                       ← build output — generated, don't hand-edit
└── .chromesite/
    ├── site.config.json        ← framework, paragraph mode, deploy target
    ├── nav.json                ← header/footer menu structure
    ├── pages.json              ← optional per-page <title>/meta overrides
    ├── block-library.md        ← generated list of available blocks
    ├── blocks/                 ← this site's reusable custom blocks
    ├── templates/              ← page layout(s); active one set in config
    ├── compose.js              ← generated — headless preview renderer
    └── compose-core.js         ← generated — shared substitution logic
```

### Page files are fragments, not full documents

Every `*.html` file at the project root is just the **body content** for
that page. Don't add `<!DOCTYPE>`, `<html>`, `<head>`, or `<body>` tags —
the active layout template supplies all of that by substituting
`{{CONTENT}}` with the page file's contents at publish/preview time.

### The template controls everything around the content

`.chromesite/site.config.json` → `activeTemplate` names which file in
`.chromesite/templates/` wraps every page. This starter includes two:

- **`template.html`** — the active one. A fuller Bootstrap layout with a
  fixed navbar, a three-column footer, and a post-footer bar. Good
  reference for a marketing-style site.
- **`simple-layout.html`** — a minimal alternative (bare header/main/footer,
  no framework assumptions baked in) — a lighter starting point if you're
  building something plainer, or want to see the minimum a template needs
  to implement.

Whichever template is active, it defines where these placeholders go:

| Placeholder            | Filled with                                   |
| ----------------------- | ---------------------------------------------- |
| `{{CONTENT}}`           | The current page's fragment                    |
| `{{TITLE}}`              | From `pages.json`, or a default built from the filename + site name |
| `{{META_DESCRIPTION}}`  | From `pages.json`, or blank                    |
| `{{NAV:header}}` / `{{NAV:footer}}` | Rendered menu markup from `nav.json`, per the framework in use |
| `{{FRAMEWORK_ASSETS}}`  | CSS/JS tags for whichever `cssFramework` is configured |
| `{{SITE_NAME}}`         | From `site.config.json`                        |
| `{{YEAR}}`              | Current year                                   |

To build your own template variant, copy one of the existing files in
`.chromesite/templates/`, adjust markup, and point `activeTemplate` at it.

### `site.config.json` drives what markup is "correct"

Don't assume Bootstrap classes or `<p>` paragraphs are always right — check
this file before writing any markup:

- **`cssFramework`** — `bootstrap5`, `tailwind`, or `none`. This starter is
  set to `bootstrap5`; class names throughout the template, blocks, and
  pages assume that. If you change this, existing markup needs to be
  updated to match — classes for the wrong framework are dead weight (or
  actively broken) in published output.
- **`paragraphMode`** — `p` or `div`. Matches how the visual editor's Enter
  key behaves; keep hand-written content consistent with it.
- **`activeTemplate`** — see above.
- **`deploymentTarget`** / **`deployDirectory`** — where "Publish" sends
  the site (this starter uses local / `dist`).

### Making a page reachable

Dropping a new `*.html` file at the project root is not enough by itself —
nothing links to it yet. Two more files, both in `.chromesite/`:

- **`nav.json`** — add an entry to the `header` and/or `footer` menu.
  Supports nested `children` for dropdowns:
  ```json
  { "label": "New Page", "href": "/some-page.html" }
  ```
- **`pages.json`** *(optional)* — per-page `<title>`/meta description
  override, keyed by filename. Worth setting for anything meant to be
  found via search or shared as a link; minor pages can skip it and fall
  back to the default title.

### Blocks — reusable content sections

Blocks are HTML snippets (heroes, CTAs, pricing tables, etc.) insertable
from the editor's 🧩 Blocks dialog. This starter ships several
site-specific ones in `.chromesite/blocks/`:

- `header-hero.html`, `about.html`, `cta.html`, `pricing-block.html`,
  `contact-us.html`, `articles.html`

Anything dropped into `.chromesite/blocks/<name>.html` shows up
automatically as an insertable tile labeled from the filename — use this
for any section likely to be reused across pages, instead of duplicating
markup by hand across pages.

The extension also ships built-in blocks (Hero, CTA, Testimonial,
Container, Contact, 3-Column Features, Table, Video/Misc Embed) already
adapted to this site's `cssFramework`. **See
[`.chromesite/block-library.md`](.chromesite/block-library.md)** for the
full current list with real markup — it's regenerated every time the
project is opened in the editor, so check it rather than this README for
the up-to-date inventory.

### Template Elements and Favicons

`elements/` is intended to hold template pieces you don't want ChromeSite
to make available to admin users (i.e. favicons, backgrounds, shims, etc.)

`elements/` can hold a full favicon/touch-icon set (Apple, Android, MS tile
icons) plus `manifest.json` and `browserconfig.xml`, already wired up from
`.chromesite/templates/template.html` in this case. Regenerate this set 
for your own brand and drop the files in with the same names, or edit the 
template's `<link>` tags if you change the set's naming/sizes.

The starter template uses the format from the 
[Favicon Generator](https://www.favicon-generator.org/), but any will work. 
ChromeSite doesn't deploy a favicon.ico at the site root, so you will need 
to specify favicon links in your template.

## Do not hand-edit

These are regenerated and any manual changes will be overwritten:

- **`dist/`** (or whatever `deployDirectory` points at) — build output from
  "Render to Local Folder."
- **`.chromesite/compose.js`**, **`.chromesite/compose-core.js`**,
  **`.chromesite/block-library.md`** — regenerated every time the project
  folder is opened in the editor.

Everything else — `CLAUDE.md`, `.chromesite/templates/`,
`.chromesite/site.config.json`, `.chromesite/nav.json`,
`.chromesite/pages.json` — is copied in once (or hand-authored) and safe to
edit freely. JSON config files aren't validated on load, so double-check
they stay valid; a broken file falls back to defaults silently.

## License

MIT — see [LICENSE](LICENSE).
