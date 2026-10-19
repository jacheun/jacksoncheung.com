# Jackson Cheung's portfolio

A static website built with HTML, CSS, and JavaScript. No build step or third-party runtime dependencies are required.

## Local development

Run `npm start`, then open http://127.0.0.1:8000. Python 3 is required; Node.js and npm are required for the check command.

Run `npm run check` before publishing. This checks JavaScript syntax, local HTML asset and page references, fragment targets, image alternative text, and duplicate IDs.

## Structure

- `index.html` and `about.html`: top-level pages.
- `projects/`: project detail pages; retain these paths to preserve existing links.
- `assets/css/`: page-specific styles (`home.css` and `dcsms.css`).
- `assets/js/`: independent circle animation and contact button behavior.
- `assets/`: existing image assets.
- `scripts/`: local validation tools.

Edit the HTML directly to update content. Keep styles scoped to their page, and load scripts only on pages that use them. Relative asset paths allow the site to work on static hosting without server routing.

The About and Seattle Crime Data pages are placeholders. The Leave a note button and unlinked project cards also remain unfinished. The contact button copies the email address and opens an email draft if clipboard access fails. Background animation follows the system's reduced-motion preference and pauses when the page is hidden.

Deploy the HTML files, `projects/`, and `assets/` to any static host. No compilation is necessary.
