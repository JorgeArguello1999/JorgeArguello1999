# Jorge Argüello — Personal Website

A minimalist, accessible, dark-themed static website with EN / ES / KO translations.

## Structure

```
├── index.html          # Home / gallery page
├── about/              # About me section
│   └── index.html
├── projects/           # Projects section
│   └── index.html
├── blog/               # Blog section
│   └── index.html
├── css/
│   └── theme.css       # Dark theme and shared styles
└── js/
    └── i18n.js         # Translation engine (EN / ES / KO)
```

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deploy to GitHub Pages

Push to your repository and enable GitHub Pages from the branch you use for deployment.

The site is fully static: no build step required.
