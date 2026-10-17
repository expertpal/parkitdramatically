# Run the game locally

From the extracted park-it-dramatically directory:

```sh
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000 in your browser. Serve the files over HTTP; opening index.html directly will not load ES modules correctly.

No dependency installation or build step is needed. To run the automated tests with Node.js installed:

```sh
npm test
```

For hosting elsewhere, upload the contents of dist/ to a static web host. The .openai/hosting.json file belongs to the original hosted project and is not needed for independent hosting.

Includes the Mars finale, touch controls, progression, all artwork, tests and concept reference. Progress is saved in browser local storage; the new localhost or hosting origin starts with its own progress.

Character and car animation studies: http://localhost:8000/art-preview.html


## Public social previews

Before uploading dist to your custom domain, run from the project folder:

```sh
node configure-site-url.mjs https://parkitdramatically.com/
```

For GitHub Pages without a custom domain, use the full Pages URL including the repository path instead. This updates the canonical and social image URLs. Upload all of dist, including assets/social-cover-v11.png. Social preview crawlers need public access; owner-private previews cannot be scraped.

Firefox/download-only browsers request a PNG immediately when you click Share how I parked. If an embedded host blocks it, open the game directly. Download PNG and Open full-size image remain available. Live browser verification is still needed.
