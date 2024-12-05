import { define, View } from "@calpoly/mustang";
import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { Routine, Exercise } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../styles/reset.css";
import { EntryElement } from "../components/exercise-entry";

export class LogViewElement extends View<Model, Msg> {
  static uses = define({
    "exercise-entry": EntryElement,
  });

  @property({ attribute: "name", reflect: true })
  name = "";

  @property({ attribute: "user-id", reflect: true })
  userid = "";

  @state()
  get routine(): Routine | undefined {
    return this.model.routine;
  }

  constructor() {
    super("log:model");
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "name" && oldValue !== newValue && newValue) {
      this.dispatchMessage([
        "routine/select",
        { username: this.userid, name: newValue },
      ]);
    }
  }

  render() {
    const { workouts = [] } = this.routine || {};
    if (!workouts || workouts.length === 0) {
      return;
    }
    const log = workouts.map(({ _id, name, exercises }) => {
      if (!_id) return;
      return this.renderWorkout([_id.toString(), name, exercises]);
    });
    return html`
      <style>
        main.page {
          --page-grids: ${workouts.length};
        }
      </style>
      <main class="page">
        <section class="log">${log}</section>
      </main>
    `;
  }

  renderWorkout([_id, name, exercises]: [string, string, Exercise[]]) {
    return html`
      <section class="workout">
        <h2>
          <span>${name}</span>
          <!-- TODO: set up icons -->
          <svg class="icon">
            <use
              href="/icons/workouts.svg#icon-${name === "Upper"
                ? "push"
                : name === "Lower"
                ? "legs"
                : name.toLowerCase()}"
            />
          </svg>
        </h2>
        <section class="exercises">
          <dl>
            ${exercises?.map(
              ({ exercise_ref, exercise_name }) =>
                html`
                  <exercise-entry
                    .routine=${this.routine}
                    workoutId=${_id}
                    workoutName=${name}
                    exerciseName=${exercise_name}
                    exerciseRef=${exercise_ref}
                  />
                `
            )}
          </dl>
        </section>
      </section>
    `;
  }

  static styles = [
    reset.styles,
    css`
      main {
        background-color: var(--color-background-page);
        color: var(--color-text);
        font-family: var(--font-family-body);
        font-weight: var(--font-weight-normal);
        line-height: var(--font-line-height-body);
        font-size: var(--size-type-body);
      }
      h2 {
        font-size: var(--size-type-xlarge);

        background-color: var(--color-background-header);
        border: var(--size-border) solid var(--color-accent);
        color: var(--color-text);
        font-family: var(--font-family-display);
        font-weight: var(--font-weight-bold);
        line-height: var(--font-line-height-display);
      }
      h3 {
        font-size: var(--size-type-large);
      }
      .page > section {
        margin: 0 var(--size-spacing-large) var(--size-spacing-large)
          var(--size-spacing-large);
      }
      span {
        color: var(--color-link);
      }
      svg.icon {
        display: inline;
        height: 1.9em;
        width: 1.9em;
        vertical-align: middle;
        fill: currentColor;
      }

      main.page {
        display: grid;
        grid-template-columns: [start] repeat(var(--page-grids), 1fr) [end];
        column-gap: var(--size-spacing-medium);
      }
      .log {
        grid-column: start / end;
        display: grid;
        grid-template-columns: subgrid;

        > h2 {
          grid-column: auto / span 1;
        }
      }
      .workout > h2 {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .exercises {
        > dl {
          --page-grids: 2;

          display: grid;
          grid-template-columns: [start] repeat(var(--page-grids), 1fr) [end];

          > exercise-entry {
            border: var(--size-border) solid var(--color-accent);
            border-top: none;
            padding: var(--size-spacing-medium);
          }
        }
        :nth-child(even) {
          border-left: none;
        }
      }
    `,
  ];
}
