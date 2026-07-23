# Evergreen Edge Lawn & Landscape

A static, multi-page HTML5/CSS3/vanilla JavaScript website for the fictional Evergreen Edge Lawn & Landscape business.

## Structure
`index.html` is the homepage. The remaining HTML files are dedicated service, residential, commercial, projects, service-area, about, contact, privacy, and thank-you pages. `styles.css` contains brand styling, `script.js` supplies progressive enhancements, and `form-handler.php` is an optional shared-hosting form endpoint. Image, icon, and logo directories are provided under `assets/` for future local assets.

## Open locally
Open `index.html` directly in a modern browser; navigation and JavaScript features work without a build step. Tailwind and the optional web fonts are loaded from their CDNs, while the current SVG image placeholders are local and display without an image-hosting connection.

For a local server, run `python3 -m http.server 8000` from this directory and open `http://localhost:8000`. PHP form submission cannot run by double-clicking HTML because PHP needs a PHP-enabled server. Test it locally with `php -S localhost:8000` if PHP is installed.

## Customize and deploy
Replace the fictional company details in the HTML templates and `form-handler.php`; update the recipient `$recipient` before deploying. The current images are local SVG art-direction placeholders in `assets/images/`. Each image's `alt` text also contains a ready-to-use, detailed LLM image-generation prompt. Replace the SVG files with optimized local WebP or AVIF images using the same filenames, preserving the image dimensions and revising the alt text to describe the final image for visitors using assistive technology. Shared hosting can deploy all files, including PHP. GitHub Pages is static: remove/change the PHP form action and connect an external form provider (for example, a hosted form endpoint) instead.

Update every page's title, description, canonical, and Open Graph metadata for the production domain. Update `sitemap.xml` and `robots.txt` from `https://example.com/` to the final canonical domain whenever URLs change.

## Checks
Use browser device emulation to test small phones through wide desktop layouts. Check keyboard navigation, mobile menu, form errors, FAQ controls, filters, and image lightboxes. Run Lighthouse in Chrome DevTools and use an accessibility checker such as axe DevTools before production. Validate JSON-LD with Google's Rich Results Test and validate sitemap XML after setting the live domain.
