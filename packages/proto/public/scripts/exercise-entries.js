import { css, html, shadow } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class ExerciseEntriesElement extends HTMLElement {
  static template = html`
    <template>
      <section class="exercise">
        <dt>
          <a href="/exercise/exercise.html"><slot>Exercise</slot></a>
        </dt>
        <slot name="entries">
          <dd>No entries yet</dd>
        </slot>
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

  get entries() {
    return this.getAttribute("entries")
      ? JSON.parse(this.getAttribute("entries"))
      : [];
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

    const entriesSlot = template.querySelector('slot[name="entries"]');
    if (entries.length > 0) {
      const entryList = entries.map((entry, index) => {
        const dd = document.createElement("dd");
        const a = document.createElement("a");
        a.href = `/entry/${entry.id}.html`;
        a.textContent = `Entry #${index + 1} - ${new Date(
          entry.date_added
        ).toLocaleDateString()}`;
        dd.appendChild(a);
        return dd;
      });
    }
    entriesSlot.innerHTML = "";
    entryList.forEach((entry) => entriesSlot.appendChild(entry));
  }
}
