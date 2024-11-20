import { css, html } from "@calpoly/mustang/server";
import { Entry } from "../models";
import renderPage from "./renderPage";

export class LogPage {
  data: Entry[];

  constructor(data: Entry[]) {
    this.data = data;
  }

  render() {
    return renderPage({
      body: this.renderBody(),
      stylesheets: ["/styles/log.css"],
      styles: [],
      scripts: [
        `import { define } from "@calpoly/mustang";
      import { ExerciseEntriesElement } from "/scripts/exercise-entries.js";

      define({
        "exercise-entries": ExerciseEntriesElement,
      });
      `,
      ],
    });
  }

  renderBody() {
    return html`
      <body class="page-grid">
        <mu-auth provides="log:auth">
          <my-header>
            <span slot="left">
              <h1>PPL Routine</h1>
            </span>
          </my-header>
          <section class="log">
            ${this.renderWorkoutSection("legs", "Legs", [
              { name: "Squat", ref: "squat" },
              { name: "Leg Press", ref: "leg-press" },
              { name: "Glute-Ham Raise", ref: "ghr" },
              { name: "Leg Extension", ref: "leg-extension" },
              { name: "Leg Curl", ref: "leg-curl" },
            ])}
            ${this.renderWorkoutSection("push", "Push", [
              { name: "Bench Press", ref: "bench-press" },
            ])}
            ${this.renderWorkoutSection("pull", "Pull", [
              { name: "Pull-up", ref: "pull-up" },
            ])}
          </section>
        </mu-auth>
      </body>
    `;
  }

  renderWorkoutSection(
    ref: string,
    title: string,
    exercises: { name: string; ref: string }[]
  ) {
    return html`
      <section class="workout">
        <h2>
          <a href="/workout/${ref}.html">${title}</a>
          <svg class="icon">
            <use href="/icons/workouts.svg#icon-${ref}" />
          </svg>
        </h2>
        <section class="exercises">
          <dl>
            ${exercises.map(
              (exercise) =>
                html`
                  <exercise-entries
                    src="/api/entry/exercise/${exercise.ref}"
                    ref=${exercise.ref}
                  >
                    ${exercise.name}
                  </exercise-entries>
                `
            )}
          </dl>
        </section>
      </section>
    `;
  }
}
