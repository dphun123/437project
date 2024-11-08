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
        <my-header>
          <span slot="left">
            <h1>PPL Routine</h1>
          </span>
          <span slot="right">
            <p><a href="/user/dennis.html">Dennis</a>' Workout Log</p>
          </span>
        </my-header>
        <section class="log">
          ${this.renderWorkoutSection("legs", "Legs", [
            { name: "Squat", link: "squat" },
            { name: "Leg Press", link: "leg-press" },
            { name: "Glute-Ham Raise", link: "ghr" },
            { name: "Leg Extension", link: "leg-extension" },
            { name: "Leg Curl", link: "leg-curl" },
          ])}
          ${this.renderWorkoutSection("push", "Push", [
            { name: "Bench Press", link: "bench-press" },
          ])}
          ${this.renderWorkoutSection("pull", "Pull", [
            { name: "Pull-up", link: "pull-up" },
          ])}
        </section>
      </body>
    `;
  }

  renderWorkoutSection(
    ref: string,
    title: string,
    exercises: { name: string; link: string }[]
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
            ${exercises.map((exercise) => this.renderExerciseEntries(exercise))}
          </dl>
        </section>
      </section>
    `;
  }

  renderExerciseEntries(exercise: { name: string; link: string }) {
    // const {
    //   _id,
    //   exercise,
    //   date_added,
    //   sets,
    //   comment,
    //   last_modified,
    // } = entry;

    return html`
      <exercise-entries link="${exercise.link}">
        ${exercise.name}
      </exercise-entries>
    `;
  }
}
