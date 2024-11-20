import { css, html } from "@calpoly/mustang/server";
import { Entry } from "../models";
import renderPage from "./renderPage";

export class EntryPage {
  data: Entry;

  constructor(data: Entry) {
    this.data = data;
  }

  render() {
    return renderPage({
      body: this.renderBody(),
      stylesheets: ["/styles/exercise.css"],
      styles: [],
      scripts: [
        `import { define } from "@calpoly/mustang";
      import { EntryElement } from "/scripts/entry.js";
      define({
        "exercise-entry": EntryElement,
      });
      `,
      ],
    });
  }

  renderBody() {
    const { _id } = this.data;
    const api = `/api/entry/${_id}`;

    return html`
      <body class="page">
        <mu-auth provides="log:auth">
          <my-header>
            <span slot="left">
              <a href="/">&larr; Workout Log</a>
            </span>
          </my-header>
          <exercise-entry src="${api}" />
        </mu-auth>
      </body>
    `;
  }
}
