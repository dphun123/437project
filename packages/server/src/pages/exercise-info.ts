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
    const exerciseInfo = this.renderExerciseInfo(this.data);

    return html`
      <body class="page-grid">
        <my-header>
          <span slot="left">
            <a href="/workout/legs.html">&larr; Legs Workout</a>
          </span>
        </my-header>
        ${exerciseInfo}
      </body>
    `;
  }

  renderExerciseInfo(exerciseInfo: ExerciseInfo) {
    const {
      name,
      description,
      muscles,
      type,
      mechanic,
      level,
      instructions,
      images,
    } = exerciseInfo;
    const instructionsList = instructions
      ? html`
          <ol>
            ${instructions.map((instruction) => html`<li>${instruction}</li>`)}
          </ol>
        `
      : html`<p>"No instructions.</p>`;
    const imagesList = images
      ? html`
          ${images.map(
            (image) =>
              html`<img src=${image} style="width: 400px; height: auto" />`
          )}
        `
      : "";

    return html`
      <exercise-info>
        <span slot="name">${name || "Exercise"}</span>
        <span slot="description">
          ${description || "No description found."}
        </span>
        <span slot="muscles">${muscles.join(", ") || "N/A"}</span> <br />
        <span slot="type">${type.join(", ") || "N/A"}</span>
        <span slot="mechanic"> ${mechanic || "N/A"} </span>
        <span slot="level">${level || "N/A"}</span>
        <span slot="instructions"> ${instructionsList} </span>
        <span slot="images">${imagesList}</span>
      </exercise-info>
    `;
  }
}
