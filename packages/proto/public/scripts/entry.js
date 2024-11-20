import { css, html, shadow, Observer } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class EntryElement extends HTMLElement {
  static template = html`
    <template>
      <section class="entry-info">
        <h2><slot name="exercise_name">Exercise</slot></h2>
        <p>
          <b>Date Added:</b> <slot name="date_added">N/A</slot> <br/>
          <b>Last Modified:</b> <slot name="last_modified">N/A</slot>
        </p>
      </section>
        <section class="sets-info">
          <h3>Sets</h3>
          <ul>
            <slot name="sets">
              <li>No sets data available.</li>
            </slot>
          </ul>
        </section>
        <section class="comment">
          <h3>Comment</h3>
          <p><slot name="comment">No comment.</slot></p>
        </section>
      </section>
    </template>
  `;

  static styles = css`
    h1,
    h2 {
      background-color: var(--color-background-header);
      border: var(--size-border) solid var(--color-accent);
      color: var(--color-text);
      font-family: var(--font-family-display);
      font-weight: var(--font-weight-bold);
      line-height: var(--font-line-height-display);
      padding: var(--size-spacing-medium);
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
    .entry-info,
    .sets-info {
      > * {
        margin-bottom: var(--size-spacing-small);
      }
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

  constructor() {
    super();
    shadow(this)
      .template(EntryElement.template)
      .styles(reset.styles, EntryElement.styles);
  }

  _authObserver = new Observer(this, "log:auth");
  connectedCallback() {
    this._authObserver.observe(({ user }) => {
      this._user = user;
      if (this.src) this.hydrate(this.src);
    });
  }

  hydrate(url) {
    fetch(url, { headers: this.authorization })
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
    const entry = Object.entries(json);
    const toSlot = ([key, value]) => {
      switch (key) {
        case "date_added":
        case "last_modified":
          value = new Date(value);
          value = value.toLocaleDateString("en-US", {
            year: "numeric",
            weekday: "long",
            month: "long",
            day: "numeric",
          });
          return html`<span slot="${key}">${value}</span>`;
        case "sets":
          return html`
            <span slot="sets">
              <ul>
                ${value.map(
                  (set) => html`<li>${set.weight} x ${set.repetitions}</li>`
                )}
              </ul>
            </span>
          `;

        default:
          return html`<span slot="${key}">${value}</span>`;
      }
    };
    const fragment = entry.map(toSlot);
    this.replaceChildren(...fragment);
  }
}
