import {
  css,
  html,
  shadow,
  Observer,
  define,
  Form,
  InputArray,
} from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class EntryElement extends HTMLElement {
  static uses = define({
    "mu-form": Form.Element,
    "input-array": InputArray.Element,
  });

  static template = html`
    <template>
      <section class="entry-info">
        <h2><slot name="exercise_name">Exercise</slot></h2>
        <p>
          <b>Date Added:</b> <slot name="date_added">N/A</slot> <br />
          <b>Last Modified:</b> <slot name="last_modified">N/A</slot>
        </p>
      </section>
      <section class="view">
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
        <button id="edit">Edit</button>
      </section>
      <mu-form class="edit">
        <section class="sets-info">
          <h3>Sets</h3>
          <div class="set-pairs">
            <div>
              <h4>Weight</h4>
              <input-array type="number" name="weight">
                <span slot="label-add">Add a set</span>
              </input-array>
            </div>
            <div>
              <h4>Repetitions</h4>
              <input-array type="number" name="repetitions"> </input-array>
            </div>
          </div>
        </section>
        <section class="comment">
          <h3>Comment</h3>
          <input name="comment" />
        </section>
      </mu-form>
    </template>
  `;

  static styles = css`
    :host {
      display: contents;
    }
    :host([mode="edit"]),
    :host([mode="new"]) {
      --display-view-none: none;
    }
    :host([mode="view"]) {
      --display-editor-none: none;
    }
    section.view {
      display: var(--display-view-none, grid);
    }
    mu-form.edit {
      display: var(--display-editor-none, grid);
    }
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
    section,
    mu-form,
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
    .set-pairs {
      display: flex;
      gap: 20px;
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

  get form() {
    return this.shadowRoot.querySelector("mu-form.edit");
  }

  get mode() {
    return this.getAttribute("mode");
  }

  set mode(m) {
    this.setAttribute("mode", m);
  }

  get editButton() {
    return this.shadowRoot.getElementById("edit");
  }

  constructor() {
    super();
    shadow(this)
      .template(EntryElement.template)
      .styles(reset.styles, EntryElement.styles);

    this.addEventListener("mu-form:submit", (event) =>
      this.submit(this.src, event.detail)
    );

    this.editButton.addEventListener("click", () => (this.mode = "edit"));
  }

  _authObserver = new Observer(this, "log:auth");
  connectedCallback() {
    this._authObserver.observe(({ user }) => {
      this._user = user;
      if (this.src && this.mode !== "new") this.hydrate(this.src);
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
        const editedJson = {
          ...json,
          weight: json.sets.map((set) => set.weight),
          repetitions: json.sets.map((set) => set.repetitions),
        };
        console.log(editedJson);
        this.form.init = editedJson;
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

  submit(url, json) {
    const method = this.mode === "new" ? "POST" : "PUT";

    const reversedJson = {
      ...json,
      sets: json.weight.map((weight, index) => ({
        weight: weight,
        repetitions: json.repetitions[index],
      })),
      last_modified: Date.now(),
    };
    delete json.weight;
    delete json.repetitions;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...this.authorization,
      },
      body: JSON.stringify(reversedJson),
    })
      .then((res) => {
        if (res.status !== (this.mode === "new" ? 201 : 200))
          throw `Status: ${res.status}`;
        return res.json();
      })
      .then((json) => {
        this.renderSlots(json);
        const editedJson = {
          ...json,
          weight: json.sets.map((set) => set.weight),
          repetitions: json.sets.map((set) => set.repetitions),
        };
        this.form.init = editedJson;
        this.mode = "view";
      })
      .catch((error) => {
        console.log(`Failed to submit ${url}:`, error);
      });
  }
}
