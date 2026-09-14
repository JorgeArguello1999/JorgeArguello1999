# Jorge Argüello — Personal Website

A minimalist, accessible, dark-themed static website with EN / ES / KO translations.

## Structure

```
├── docs/               # Website source (deployed to GitHub Pages)
│   ├── index.html      # Home / gallery page
│   ├── about/
│   │   └── index.html  # About me section
│   ├── projects/
│   │   └── index.html  # Projects section
│   ├── blog/
│   │   ├── index.html  # Blog section (videos + posts)
│   │   ├── post.html   # Single post view
│   │   └── posts/      # Markdown posts (YYYY-MM-DD-slug.md)
│   ├── data/           # Static DB (no backend) — generated
│   │   ├── youtube.json # Videos from https://www.youtube.com/@al3x_argu
│   │   ├── posts.json   # Index of markdown posts
│   │   └── db.json      # Combined DB (youtube + posts)
│   ├── css/
│   │   └── theme.css   # Dark theme and shared styles
│   └── js/
│       └── i18n.js     # Translation engine (EN / ES / KO)
├── scripts/
│   └── update-data.js  # Generates docs/data/*.json (YouTube RSS + local md)
└── README.md
```

## Run locally

```bash
python3 -m http.server 8000 --directory docs
```

Then open http://localhost:8000

## Data (YouTube + Blog) — no backend

This site **requires no backend**. YouTube and Blog are served as static JSON in `docs/data/` and loaded on every deploy.

- **YouTube source**: `https://www.youtube.com/@al3x_argu` (channel `UCVgabwEiFAunNH6c7abqoCQ`) via feed `https://www.youtube.com/feeds/videos.xml?channel_id=...`
- **Blog source**: markdown files in `docs/blog/posts/YYYY-MM-DD-slug.md`
- **Translations**: site UI is available in EN / ES / KO (see `window.TRANSLATIONS` in each HTML file). All code, comments, and logs are in English.

### Generate / update the database

```bash
node scripts/update-data.js
# generates:
#   docs/data/youtube.json
#   docs/data/posts.json
#   docs/data/db.json

# also via npm
npm run update:data
```

How to use:

1. **Add a post**: create `docs/blog/posts/2026-09-14-my-post.md` with `# Title` on top, then `node scripts/update-data.js`
2. **YouTube**: the script fetches the RSS feed. If you publish a new public video on your channel, it will be included in the next `node scripts/update-data.js` or automatically every Monday via GitHub Actions.
3. Commit and push: `git add docs/data docs/blog/posts && git commit -m "new post" && git push`

Frontend (`docs/blog/index.html` and `post.html`) does:

```
fetch('../data/db.json') -> fetch('../data/youtube.json' | '../data/posts.json') -> fallback to RSS/GitHub API -> inline fallback
```

Fully static, no backend — data loads/updates on every site update.

### Automation (GitHub Actions)

`.github/workflows/update-data.yml`:

- Runs on every push to `main`/`pre-production` touching `docs/blog/posts/**` or `scripts/update-data.js`
- Runs every Monday `0 6 * * 1` to refresh YouTube videos even without a push
- Runs `node scripts/update-data.js` and commits `docs/data/*.json` if changed

You can trigger it manually from **Actions → Update static DB → Run workflow**.

## Deploy to GitHub Pages

The site lives in `docs/`. To deploy:

1. Push this branch to GitHub.
2. In the repo **Settings → Pages**, set **Source** to:
   - **Branch**: your deployment branch, and
   - **Folder**: `/docs`

No build step is required — plain static files (JSON in `docs/data/` is the static "backend").