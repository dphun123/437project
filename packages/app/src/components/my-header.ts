import {
  Auth,
  History,
  Observer,
  Events,
  View,
  define,
} from "@calpoly/mustang";
import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../styles/reset.css";
import { MyDropdownElement } from "./my-dropdown";
import { Routine } from "server/models";

function toggleDarkMode(ev: InputEvent) {
  const target = ev.target as HTMLInputElement;
  const checked = target.checked;
  Events.relay(ev, "dark-mode", { checked });
}

function signOut(ev: MouseEvent) {
  Events.relay(ev, "auth:message", ["auth/signout"]);
}

export class HeaderElement extends View<Model, Msg> {
  static uses = define({
    "my-dropdown": MyDropdownElement,
  });

  @property()
  userid?: string;

  @state()
  location?: string;

  @state()
  get routine(): Routine | undefined {
    return this.model.routine;
  }

  @state()
  get routineNames(): string[] | undefined {
    return this.model.routineNames;
  }

  constructor() {
    super("log:model");
  }

  _authObserver = new Observer<Auth.Model>(this, "log:auth");
  _histObserver = new Observer<History.Model>(this, "log:history");

  connectedCallback() {
    super.connectedCallback();

    this._authObserver.observe(({ user }) => {
      if (user && user.username !== this.userid) {
        this.userid = user.username;
        const anchor = this.shadowRoot?.querySelector("#userid")
          ?.parentNode as HTMLAnchorElement;
        anchor.href = `/user/${this.userid}`;
      }
    });

    this._histObserver.observe(({ location }) => {
      if (location && location.pathname !== this.location) {
        this.location = location.pathname;
      }
    });
    this.dispatchMessage(["routine/list", {}]);
  }

  updateWeek() {
    this.dispatchMessage([
      "routine/updateWeek",
      {
        routine: this.routine,
        onSuccess: () => {},
        onFailure: (error: Error) => console.log("ERROR:", error),
      },
    ]);
  }

  render() {
    const { latest_week } = this.routine || {};
    const week = this.renderWeek(latest_week);
    return html`
      <header>
        ${this.location?.startsWith("/app/routine/") || this.location === "/app"
          ? html`<my-dropdown
              location=${this.location}
              .selectedRoutine=${this.routine?.name}
              .routines=${this.routineNames}
            ></my-dropdown>`
          : html`<a class="link" href="/">&larr; Return Home</a>`}
        ${this.location?.startsWith("/app/routine/") ? week : ""}
        <div>
          <a>
            Hello,
            <a
              ><span id="userid"
                >${this.userid === "anonymous" ? "" : this.userid}</span
              ></a
            >
          </a>
          <menu>
            <li>
              <label @change=${toggleDarkMode}>
                <input type="checkbox" autocomplete="off" />
                Dark mode
              </label>
            </li>
            <li class="when-signed-in">
              <a class="link" id="signout" @click=${signOut}>Sign Out</a>
            </li>
            <li class="when-signed-out">
              <a class="link" href="/login">Sign In</a>
            </li>
          </menu>
        </div>
      </header>
    `;
  }

  renderWeek(week?: number) {
    return html`<div class="change-week">
      <button
        class="change-button ${week === 1 ? "disabled" : ""}"
        @click="${this.goToPreviousWeek}"
        ?disabled="${week === 1}"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="prev-button"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      <span class="week-label">Week ${week}</span>

      <button class="change-button" @click="${this.goToNextWeek}">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="next-button"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>`;
  }

  goToPreviousWeek() {
    if (this.routine && this.routine.latest_week > 0) {
      this.routine.latest_week--;
      this.updateWeek();
    }
  }

  // Handler to go to the next week
  goToNextWeek() {
    if (this.routine) {
      console.log("incrementing week");
      this.routine.latest_week++;
      this.updateWeek();
    }
  }

  static styles = [
    reset.styles,
    css`
      header {
        background-color: var(--color-background-header);
        border: var(--size-border) solid var(--color-accent);
        color: var(--color-text);
        font-family: var(--font-family-display);
        font-weight: var(--font-weight-bold);
        line-height: var(--font-line-height-display);

        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--size-spacing-medium);

        margin-bottom: var(--size-spacing-large);
      }
      .link {
        color: var(--color-link);
        cursor: pointer;
        text-decoration: underline;
      }
      #userid:empty::before {
        content: "user";
      }
      #userid:empty {
        color: var(--color-text);
        text-decoration: none;
      }
      #userid:not(:empty) {
        color: var(--color-link);
        cursor: pointer;
        text-decoration: underline;
      }
      menu li input {
        cursor: pointer;
      }
      a:has(#userid:empty) ~ menu > .when-signed-in,
      a:has(#userid:not(:empty)) ~ menu > .when-signed-out {
        display: none;
      }

      .change-week {
        display: flex;
        padding-top: 0.5rem;

        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
      .change-button {
        background-color: inherit;
        border: none;
        color: var(--color-text);
        cursor: pointer;
      }
      .change-button:hover {
        color: var(--color-accent);
      }
      .change-button.disabled {
        color: var(--color-background-header);
        background-color: inherit;
        cursor: auto;
      }
      .prev-button {
        transform: rotate(90deg);
      }
      .next-button {
        transform: rotate(-90deg);
      }
      .week-label {
        font-size: var(--size-type-large);
      }
    `,
  ];
}
