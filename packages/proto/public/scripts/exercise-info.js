import { css, html, shadow } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class ExerciseInfoElement extends HTMLElement {
  static template = html`
    <template>
      <section class="definition">
        <h1><slot name="name">Exercise</slot></h1>
        <p><slot name="description">No description found.</slot></p>
      </section>
      <section class="instruction">
        <h2>Instructions</h2>
        <slot name="instructions">No instructions found.</slot> <br />
        <p>
          <b>Type:</b> <slot name="type">N/A</slot> <br />
          <b>Mechanic:</b> <slot name="mechanic">N/A</slot> <br />
          <b>Main muscles targeted:</b> <slot name="muscles">N/A</slot> <br />
          <b>Level:</b> <slot name="level">N/A</slot>
        </p>
      </section>
      <section class="images">
        <slot name="images"></slot>
      </section>
    </template>
  `;

  static styles = css`
    :host {
      grid-column: start / end;
      display: grid;
      grid-template-columns: subgrid;
    }
    h1,
    h2 {
      background-color: var(--color-background-header);
      border: var(--size-border) solid var(--color-accent);
      color: var(--color-text);
      font-family: var(--font-family-display);
      font-weight: var(--font-weight-bold);
      line-height: var(--font-line-height-display);
    }
    h1 {
      font-size: var(--size-type-xxlarge);
      font-style: oblique;
    }
    h2 {
      font-size: var(--size-type-xlarge);
    }
    section {
      margin: 0 var(--size-spacing-large) var(--size-spacing-large)
        var(--size-spacing-large);
    }
    p {
      margin: 0 var(--size-spacing-large) var(--size-spacing-large)
        var(--size-spacing-large);
    }
    img {
      border: var(--size-border) solid var(--color-accent);
      border-radius: var(--size-radius-medium);
    }

    .definition {
      grid-column: start / end;
      > * {
        margin-bottom: var(--size-spacing-small);
      }
      > h1 {
        display: flex;
        justify-content: center;
        align-content: center;
        padding: var(--size-spacing-medium);
      }
    }

    .instruction {
      grid-column: auto / span 2;
      > * {
        margin-bottom: var(--size-spacing-small);
      }
      > h2 {
        padding: var(--size-spacing-medium);
      }
    }
  `;

  get src() {
    return this.getAttribute("src");
  }

  constructor() {
    super();
    shadow(this)
      .template(ExerciseInfoElement.template)
      .styles(reset.styles, ExerciseInfoElement.styles);
  }

  connectedCallback() {
    if (this.src) this.hydrate(this.src);
  }

  hydrate(url) {
    fetch(url)
      .then((res) => {
        if (res.status !== 200) throw `Status: ${res.status}`;
        return res.json();
      })
      .then((json) => {
        this.renderSlots(json);
      })
      .catch((error) => console.log(`Failed to render data ${url}:`, error));
  }

  renderSlots(json) {
    const entries = Object.entries(json);
    const toSlot = ([key, value]) => {
      switch (key) {
        case "instructions":
          console.log(value);
          return value
            ? html`
                <span slot="instructions">
                  <ol>
                    ${value.map((instruction) => html`<li>${instruction}</li>`)}
                  </ol>
                </span>
              `
            : html`<p>"No instructions.</p>`;
        case "images":
          return value
            ? html` <span slot="images">
                ${value.map(
                  (image) =>
                    html`<img src=${image} style =width: 400px; height: auto" />`
                )}
              </span>`
            : "";
      }
      switch (typeof value) {
        case "object":
          if (Array.isArray(value))
            return html` <span slot="${key}">${value.join(", ")}</span> `;
        default:
          return html`<span slot="${key}">${value}</span>`;
      }
    };
    const fragment = entries.map(toSlot);
    this.replaceChildren(...fragment);
  }
}
