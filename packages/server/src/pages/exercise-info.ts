import { css, html } from "@calpoly/mustang/server";
import { ExerciseInfo } from "../models";
import renderPage from "./renderPage";

export class ExerciseInfoPage {
  data: ExerciseInfo;

  constructor(data: ExerciseInfo) {
    this.data = data;
  }

  render() {
    return renderPage({
      body: this.renderBody(),
      stylesheets: ["/styles/exercise.css"],
      styles: [],
      scripts: [
        `import { define } from "@calpoly/mustang";
      import { ExerciseInfoElement } from "/scripts/exercise-info.js";
      define({
        "exercise-info": ExerciseInfoElement,
      });
      `,
      ],
    });
  }

  renderBody() {
    const { ref } = this.data;
    const api = `/api/exercise/${ref}`;

    return html`
      <body class="page-grid">
        <my-header>
          <span slot="left">
            <a href="/workout/legs.html">&larr; Legs Workout</a>
          </span>
        </my-header>
        <exercise-info src="${api}" />
      </body>
    `;
  }
}
