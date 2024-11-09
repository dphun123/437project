import { PageParts, renderWithDefaults } from "@calpoly/mustang/server";

const defaults = {
  stylesheets: ["/styles/reset.css", "/styles/tokens.css", "/styles/page.css"],
  styles: [],
  scripts: [
    `import { define } from "@calpoly/mustang";
    import { HeaderElement } from "/scripts/header.js";

    define({
      "my-header": HeaderElement
    });

    HeaderElement.initializeOnce();
    `,
  ],
  googleFontURL:
    "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Poppins:wght@400;600&display=swap",
  imports: {
    "@calpoly/mustang": "https://unpkg.com/@calpoly/mustang",
  },
};

export default function renderPage(page: PageParts) {
  return renderWithDefaults(page, defaults);
}
