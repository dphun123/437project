import { Events } from "@calpoly/mustang";
import { LitElement, css, html } from "lit";
import reset from "../styles/reset.css";

function toggleDarkMode(ev: InputEvent) {
  const target = ev.target as HTMLInputElement;
  const checked = target.checked;
  Events.relay(ev, "dark-mode", { checked });
}

export class HeaderElement extends LitElement {
  render() {
    return html`
      <header>
        <slot name="left"></slot>
        <div>
          <a>
            Hello,
            <a><span id="userid"></span></a>
          </a>
          <menu>
            <li>
              <label @change=${toggleDarkMode}>
                <input type="checkbox" autocomplete="off" />
                Dark mode
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
    `,
  ];

  static initializeOnce() {
    function toggleDarkMode(page: HTMLElement, checked: boolean) {
      page.classList.toggle("dark-mode", checked);
    }

    document.body.addEventListener("dark-mode", (event) =>
      toggleDarkMode(
        event.currentTarget as HTMLElement,
        (event as CustomEvent).detail?.checked
      )
    );
  }
}
