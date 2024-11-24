import { css, html, shadow, Events, Observer } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class HeaderElement extends HTMLElement {
  static template = html`
    <template>
      <header>
        <slot name="left"></slot>
        <div>
          <a slot="actuator">
            Hello,
            <a><span id="userid"></span></a>
          </a>
          <menu>
            <li>
              <label class="dark-mode-switch">
                <input type="checkbox" />
                Dark Mode
              </label>
            </li>
            <li class="when-signed-in">
              <a id="signout">Sign Out</a>
            </li>
            <li class="when-signed-out">
              <a href="/login">Sign In</a>
            </li>
          </menu>
        </div>
      </header>
    </template>
  `;

  static styles = css`
    :host {
      width: 100%;
    }

    :host-context(.page-grid) {
      grid-column: start / end;
      display: grid;
      grid-template-columns: subgrid;
    }

    header {
      grid-column: start / end;

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
    #userid:empty::before {
      content: "user";
    }
    menu a {
      color: var(--color-link);
      cursor: pointer;
      text-decoration: underline;
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
  `;

  get userid() {
    return this._userid.textContent;
  }

  set userid(id) {
    if (id === "anonymous") {
      this._userid.textContent = "";
      this._signout.disabled = true;
    } else {
      this._userid.textContent = id;
      this._signout.disabled = false;
    }
  }

  constructor() {
    super();
    shadow(this)
      .template(HeaderElement.template)
      .styles(reset.styles, HeaderElement.styles);

    this._userid = this.shadowRoot.querySelector("#userid");
    this._signout = this.shadowRoot.querySelector("#signout");
    this._signout.addEventListener("click", (event) =>
      Events.relay(event, "auth:message", ["auth/signout"])
    );

    const dm = this.shadowRoot.querySelector(".dark-mode-switch");
    dm.addEventListener("click", (event) =>
      Events.relay(event, "dark-mode", {
        checked: event.target.checked,
      })
    );
  }

  static initializeOnce() {
    function toggleDarkMode(page, checked) {
      page.classList.toggle("dark-mode", checked);
    }

    document.body.addEventListener("dark-mode", (event) =>
      toggleDarkMode(event.currentTarget, event.detail.checked)
    );
  }

  _authObserver = new Observer(this, "log:auth");
  connectedCallback() {
    this._authObserver.observe(({ user }) => {
      if (user && user.username !== this.userid) {
        this.userid = user.username;
        const profile = this.shadowRoot.querySelector("#userid");
        if (profile.textContent !== "") {
          const anchor = profile.parentNode;
          anchor.href = `/user/${this.userid}`;
        }
      }
    });
  }
}
