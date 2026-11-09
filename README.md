# Portfolio

A static site: `index.html`, `styles.css`, `app.js` and `data.js`. No build, no dependency, about 70 KB.

## Change the content

Everything shown comes from `data.js`: experiences, certifications, skills, contact.

- `linkedin`: the address of the LinkedIn profile (empty: no button).
- `photo`: put a picture next to `index.html` (e.g. `photo.jpg`) and write its name (empty: the initials).
- `cv`: a public version of the CV, without address nor phone (empty: no button).

## See it locally

```
python -m http.server 8000
```

then open http://localhost:8000.

## Put it online (free)

- **GitHub Pages**: a public repository with these files, then Settings › Pages › Deploy from branch `main`, folder `/`. Address: `https://<user>.github.io/<repository>/`.
- **Netlify Drop**: drag the folder onto https://app.netlify.com/drop.
- **Cloudflare Pages**: connect the repository, no build command, output folder `/`.

A domain of your own (e.g. `eddy-odoo.dev`) can be added afterwards in any of them.
