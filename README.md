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
│   │   └── index.html  # Blog section
│   ├── css/
│   │   └── theme.css   # Dark theme and shared styles
│   └── js/
│       └── i18n.js     # Translation engine (EN / ES / KO)
└── README.md
```

## Run locally

```bash
python3 -m http.server 8000 --directory docs
```

Then open http://localhost:8000

## Deploy to GitHub Pages

The site lives in `docs/`. To deploy:

1. Push this branch to GitHub.
2. In the repo **Settings → Pages**, set **Source** to:
   - **Branch**: your deployment branch, and
   - **Folder**: `/docs`

No build step is required — everything is plain static files.