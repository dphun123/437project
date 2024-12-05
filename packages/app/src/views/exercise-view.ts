import { View } from "@calpoly/mustang";
import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { ExerciseInfo } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../styles/reset.css";

export class ExerciseViewElement extends View<Model, Msg> {
  @property()
  exerciseRef?: string;

  @state()
  get exerciseInfo(): ExerciseInfo | undefined {
    return this.model.exerciseInfo;
  }

  constructor() {
    super("log:model");
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "exerciseRef" && oldValue !== newValue && newValue) {
      this.dispatchMessage(["exercise/select", { ref: newValue }]);
    }
  }

  render() {
    const {
      name,
      description,
      muscles = [],
      type = [],
      mechanic,
      level,
      instructions = [],
      images = [],
    } = this.exerciseInfo || {};
    return html`
      <main class="page">
        <section class="definition">
          <h1>${name}</h1>
          <p>${description}</p>
        </section>
        <section class="instruction">
          <h2>Instructions</h2>
          ${instructions
            ? html`
                <span slot="instructions">
                  <ol>
                    ${instructions.map(
                      (instruction) => html`<li>${instruction}</li>`
                    )}
                  </ol>
                </span>
              `
            : html`<p>"No instructions.</p>`} <br />
          <p>
            <b>Type:</b> ${type.join(", ")} <br />
            <b>Mechanic:</b> ${mechanic} <br />
            <b>Main muscles targeted:</b> ${muscles.join(", ")} <br />
            <b>Level:</b> ${level}
          </p>
        </section>
        <section class="images">
          ${images
            ? html`
                ${images.map(
                  (image) =>
                    html`<img
                      src="${image}"
                      style="width: 400px; height: auto"
                    />`
                )}
              `
            : ""}
        </section>
      </main>
    `;
  }

  static styles = [
    reset.styles,
    css`
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

      main.page {
        --page-grids: 3;
        display: grid;
        grid-template-columns: [start] repeat(var(--page-grids), 1fr) [end];
        column-gap: var(--size-spacing-medium);
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
    `,
  ];
}
