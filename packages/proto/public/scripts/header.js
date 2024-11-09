import { css, html, shadow, Events } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class HeaderElement extends HTMLElement {
  static template = html`
    <template>
      <header>
        <slot name="left"></slot>
        <div>
          <label class="dark-mode-switch">
            <input type="checkbox" autocomplete="off" />
            Dark mode
          </label>
          <slot name="right"></slot>
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
  `;

  constructor() {
    super();
    shadow(this)
      .template(HeaderElement.template)
      .styles(reset.styles, HeaderElement.styles);

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
}
