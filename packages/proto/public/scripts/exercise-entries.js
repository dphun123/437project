import { css, html, shadow } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class ExerciseEntriesElement extends HTMLElement {
  static template = html`
    <template>
      <section class="exercise">
        <dt>
          <a href="/exercise/exercise.html"><slot>Exercise</slot></a>
        </dt>
        <dd><a href="/entry/example.html">Entry #1</a></dd>
        <dd><a href="/entry/example.html">Entry #2</a></dd>
        <dd><a href="/entry/example.html">Entry #3</a></dd>
      </section>
    </template>
  `;

  static styles = css`
    .exercise {
      --page-grids: 2;

      display: grid;
      grid-template-columns: [start] repeat(var(--page-grids), 1fr) [end];

      > dt {
        grid-column: start / end;
      }
      > dd {
        grid-column: auto / span 1;
      }
    }
    a {
      color: var(--color-link);
    }
    dt {
      font-weight: var(--font-weight-darker);
      font-size: var(--size-type-medium);
    }
  `;

  get link() {
    return this.getAttribute("link") || "exercise";
  }

  constructor() {
    super();
    shadow(this)
      .template(ExerciseEntriesElement.template)
      .styles(reset.styles, ExerciseEntriesElement.styles);
  }

  connectedCallback() {
    if (this.link) {
      const exercise = this.shadowRoot.querySelector("dt a");
      exercise.href = `/exercise/${this.link}.html`;
    }
  }
}
