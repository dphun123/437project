import { Auth, History, Observer, Events } from "@calpoly/mustang";
import { css, html, LitElement } from "lit";
import { state } from "lit/decorators.js";
import reset from "../styles/reset.css";

function toggleDarkMode(ev: InputEvent) {
  const target = ev.target as HTMLInputElement;
  const checked = target.checked;
  Events.relay(ev, "dark-mode", { checked });
}

function signOut(ev: MouseEvent) {
  Events.relay(ev, "auth:message", ["auth/signout"]);
}

export class HeaderElement extends LitElement {
  @state()
  userid: string = "anonymous";

  @state()
  location: string = "/app";

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
      console.log("LOCATION", location.pathname);
      console.log("PREV LOCATION", this.location);
      if (location && location.pathname !== this.location) {
        this.location = location.pathname;
      }
    });
  }

  render() {
    return html`
      <header>
        ${this.location === "/app"
          ? html`<h1>PPL Routine</h1>`
          : html`<a class="link" href="/">&larr; Workout Log</a>`}
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
      h1 {
        font-size: var(--size-type-xxlarge);
        font-style: oblique;
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
    `,
  ];
}
