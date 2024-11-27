import { Auth, Observer } from "@calpoly/mustang";
import { css, html, LitElement } from "lit";
import { state } from "lit/decorators.js";
// import { Routine, Workout, Exercise } from "server/models";
import reset from "../styles/reset.css";

export class HomeViewElement extends LitElement {
  // src = "/api/routine";

  @state()
  // routine = ;
  _authObserver = new Observer<Auth.Model>(this, "log:auth");

  _user = new Auth.User();

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe(({ user }) => {
      if (user) {
        this._user = user;
      }
      // this.hydrate(this.src);
    });
  }

  render() {
    const routine: [string, string, { name: string; ref: string }[]][] = [
      [
        "legs",
        "Legs",
        [
          { name: "Squat", ref: "squat" },
          { name: "Leg Press", ref: "leg-press" },
          { name: "Glute-Ham Raise", ref: "ghr" },
          { name: "Leg Extension", ref: "leg-extension" },
          { name: "Leg Curl", ref: "leg-curl" },
        ],
      ],
      ["push", "Push", [{ name: "Bench Press", ref: "bench-press" }]],
      ["pull", "Pull", [{ name: "Pull-up", ref: "pull-up" }]],
    ];
    const log = routine.map(([ref, title, exercises]) =>
      this.renderWorkout([ref, title, exercises])
    );

    return html`
      <main class="page">
        <my-header>
          <span slot="left">
            <h1>PPL Routine</h1>
          </span>
        </my-header>
        <section class="log">${log}</section>
      </main>
    `;
  }

  renderWorkout([ref, title, exercises]: [
    string,
    string,
    { name: string; ref: string }[]
  ]) {
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

  // hydrate(url: string) {
  //   fetch(url, {
  //     headers: Auth.headers(this._user),
  //   })
  //     .then((res: Response) => {
  //       if (res.status === 200) return res.json();
  //       throw `Server responded with status ${res.status}`;
  //     })
  //     .then((json: unknown) => {
  //       if (json) {
  //         const { tours } = json as { data: Array<Tour> };
  //         this.tourIndex = tours;
  //       }
  //     })
  //     .catch((err) => console.log("Failed to tour data:", err));
  // }

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
      h1 {
        font-size: var(--size-type-xxlarge);
        font-style: oblique;
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
      a {
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
        --page-grids: 3;
        display: grid;
        grid-template-columns: [start] repeat(var(--page-grids), 1fr) [end];
        column-gap: var(--size-spacing-medium);
      }
      my-header {
        grid-column: start / end;
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

          > exercise-entries {
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
