import { css, html, shadow, Observer } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class ExerciseEntriesElement extends HTMLElement {
  static template = html`
    <template>
      <section class="exercise">
        <dt>
          <a><slot>Exercise</slot></a>
        </dt>
        <dd>
          <ul>
            <slot name="entries">No entries yet</slot>
          </ul>
        </dd>
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
        grid-column: start / span 1;
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

  get authorization() {
    console.log("Authorization for user, ", this._user);
    if (this._user && this._user.authenticated)
      return {
        Authorization: `Bearer ${this._user.token}`,
      };
    else return {};
  }

  get src() {
    return this.getAttribute("src");
  }

  get ref() {
    return this.getAttribute("ref") || "exercise";
  }

  constructor() {
    super();
    shadow(this)
      .template(ExerciseEntriesElement.template)
      .styles(reset.styles, ExerciseEntriesElement.styles);
  }

  _authObserver = new Observer(this, "log:auth");
  connectedCallback() {
    this._authObserver.observe(({ user }) => {
      this._user = user;
      if (this.src) this.hydrate(this.src);
    });

    if (this.ref) {
      const exercise = this.shadowRoot.querySelector("dt a");
      exercise.href = `/exercise/${this.ref}`;
    }
  }

  hydrate(url) {
    fetch(url, { headers: this.authorization })
      .then((res) => {
        if (res.status !== 200) throw `Status: ${res.status}`;
        return res.json();
      })
      .then((json) => this.renderSlots(json))
      .catch((error) => console.log(`Failed to render data ${url}:`, error));
  }

  renderSlots(json) {
    const entries = Object.entries(json);
    if (entries.length === 0) return;
    const toSlot = (entries) => {
      return html`
        <span slot="entries">
          ${entries.map(
            ([key, entry]) => html`
              <li>
                <a href="/entry/${entry._id}">Entry #${Number(key) + 1}</a>
              </li>
            `
          )}
        </span>
      `;
    };
    const fragment = [toSlot(entries)];
    this.append(...fragment);
  }
}
