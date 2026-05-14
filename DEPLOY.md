# PanelCanvas — Deployment Guide (GitHub Pages)

## One-time setup (5 minutes)

### 1. Create a GitHub account
If you don't have one: https://github.com/signup
Pick a username that's professionally appropriate (e.g. rosasottile or similar).

### 2. Create a new repository
- Go to https://github.com/new
- Repository name: `panelcanvas`
- Set to **Public** (required for free GitHub Pages)
- Don't initialize with README
- Click "Create repository"

### 3. Upload the files
GitHub gives you an option to upload files directly (no Git needed):
- On the new repository page, click "uploading an existing file"
- Drag and drop the entire `panelcanvas/` folder contents
- IMPORTANT: maintain the folder structure:
  ```
  index.html
  panel-builder.html
  css/style.css
  js/instruments.js
  js/dyes.js
  js/markers.js
  js/scoring.js
  ```
- Scroll down, add a commit message like "Initial PanelCanvas deploy"
- Click "Commit changes"

### 4. Enable GitHub Pages
- Go to your repository → Settings → Pages (left sidebar)
- Source: "Deploy from a branch"
- Branch: `main` / `(root)`
- Click Save

### 5. Wait 2–3 minutes, then visit:
```
https://YOUR-GITHUB-USERNAME.github.io/panelcanvas/
```

That's your live URL. Share it with Rui or any PI as a link.

---

## Updating the site
Whenever you want to update (add dyes, fix bugs, etc.):
- Go to your repo on GitHub
- Click the file you want to edit → pencil icon → edit → commit
- Changes go live in ~60 seconds

---

## Adding instruments later
Open `js/instruments.js` and add a new entry to the `INSTRUMENTS` object
following the same pattern as `s6msk` or `a5se`. Then add the new option
to the sidebar in `panel-builder.html`.

---

## Adding real reference spectra permanently
Instead of uploading CSV every session, you can embed spectra directly:
1. Open `js/dyes.js`
2. After the DYES object, add:
   ```js
   const CUSTOM_SPECTRA = {
     's6msk': {
       'APC': [0.01, 0.02, ...],  // 49 values
       'BV421': [0.00, 0.03, ...],
     }
   };
   ```
3. In `js/instruments.js`, modify `getSpectrum()` to check CUSTOM_SPECTRA first.

---

## Custom domain (optional)
If you want `panelcanvas.mskcc.org` or similar, talk to IT.
For a personal domain, add a CNAME file to the repo root with your domain,
then configure DNS with your registrar.
