"""Validate static pages using only the Python standard library."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parent.parent


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.ids = set()
        self.references = []
        self.errors = []

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        identifier = attrs.get('id')
        if identifier:
            if identifier in self.ids:
                self.errors.append(f'duplicate ID: {identifier}')
            self.ids.add(identifier)
        if tag == 'img' and 'alt' not in attrs:
            self.errors.append('image is missing alternative text')
        for attribute in ('href', 'src'):
            if attrs.get(attribute):
                self.references.append(attrs[attribute])


def main():
    pages = {}
    for path in sorted(ROOT.glob('*.html')) + sorted((ROOT / 'projects').glob('*.html')):
        page = Page(path)
        page.feed(path.read_text(encoding='utf-8'))
        pages[path] = page

    for page in pages.values():
        for reference in page.references:
            url = urlsplit(reference)
            if url.scheme or url.netloc:
                continue
            target = ((ROOT if url.path.startswith('/') else page.path.parent)
                      / unquote(url.path).lstrip('/')).resolve() if url.path else page.path
            if not target.is_file():
                page.errors.append(f'missing local file: {reference}')
            elif url.fragment and target in pages:
                if unquote(url.fragment) not in pages[target].ids:
                    page.errors.append(f'missing fragment target: {reference}')

    errors = [f'{page.path.relative_to(ROOT)}: {error}'
              for page in pages.values() for error in page.errors]
    if errors:
        raise SystemExit('\n'.join(errors))
    print(f'Validated {len(pages)} pages: local references, fragments, IDs, and image alt text.')


if __name__ == '__main__':
    main()
