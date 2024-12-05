import { View, History } from "@calpoly/mustang";
import { html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { Msg } from "../messages";
import { Model } from "../model";

function selectRoutine(routine: string, component: MyDropdownElement) {
  if (component.selectedRoutine === routine) return;
  window.location.href = `/app/routine/${routine}`;
}

export class MyDropdownElement extends View<Model, Msg> {
  @property()
  open = false;

  @state()
  deleting = false;

  @state()
  routineDeleting?: string;

  @property()
  location?: string;

  @property()
  routines: string[] = [];

  @state()
  selectedRoutine?: string;

  constructor() {
    super("log:model");
  }

  addNewRoutine() {
    History.dispatch(this, "history/navigate", {
      href: `/app/routine`,
    });
  }

  deleteRoutine(routine: string) {
    this.dispatchMessage([
      "routine/delete",
      {
        name: this.routineDeleting,
        onSuccess: () => {},
        onFailure: (error: Error) => console.log("ERROR:", error),
      },
    ]);
    if (this.selectedRoutine === this.routineDeleting) {
      this.dispatchMessage(["routine/list", {}]);
      History.dispatch(this, "history/navigate", {
        href: `/app`,
      });
    }
    this.routines = this.routines.filter((r) => r !== routine);
    this.deleting = false;
    this.routineDeleting = undefined;
  }

  toggleDropdown() {
    this.open = !this.open;
  }

  confirmDelete(routine: string) {
    this.deleting = true;
    this.routineDeleting = routine;
  }

  cancelDelete() {
    this.deleting = false;
    this.routineDeleting = undefined;
  }

  render() {
    if (this.location === "/app") this.selectedRoutine = "Select a";
    return html`
      <div class="dropdown-container">
        <div class="dropdown-actuator" @click=${this.toggleDropdown}>
          <h1>
            ${this.selectedRoutine} Routine
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="dropdown-icon ${this.open ? "open" : ""}"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </h1>
        </div>
        ${this.open
          ? html`
              <ul class="dropdown-menu">
                ${this.routines.map(
                  (routine) =>
                    html`<div class="list-item">
                      <li
                        @click=${() => selectRoutine(routine, this)}
                        class="routine ${routine === this.selectedRoutine
                          ? "selected"
                          : ""}"
                      >
                        ${routine}
                      </li>
                      ${this.deleting && this.routineDeleting === routine
                        ? html`
                            <div class="confirmation">
                              <button
                                @click=${() => this.deleteRoutine(routine)}
                                class="confirm-delete"
                              >
                                Confirm
                              </button>
                              <button
                                @click=${this.cancelDelete}
                                class="cancel-delete"
                              >
                                Cancel
                              </button>
                            </div>
                          `
                        : html`
                            <button
                              @click=${() => this.confirmDelete(routine)}
                              class="delete-button"
                            >
                              X
                            </button>
                          `}
                    </div>`
                )}
                <li @click=${this.addNewRoutine} class="add-routine-button">
                  <svg viewBox="0 0 24 24" class="icon">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </li>
              </ul>
            `
          : ""}
      </div>
    `;
  }

  static styles = css`
    .dropdown-container {
      position: relative;
      display: inline-block;
    }

    .dropdown-actuator {
      cursor: pointer;
    }

    .dropdown-icon {
      transform: rotate(0deg);
      transition: transform 0.2s ease;
    }
    .dropdown-icon.open {
      transform: rotate(180deg);
    }

    .dropdown-actuator:hover .dropdown-icon {
      color: var(--color-accent);
    }

    .dropdown-menu {
      z-index: 2;
      list-style-type: none;
      position: absolute;
      min-width: 100%;
      background-color: var(--color-background-page);
      border: solid var(--color-accent);
      margin-top: 0;
      padding: 0;
    }

    .dropdown-menu .routine {
      width: 100%;
      padding: 0.5rem;
      cursor: pointer;
      color: var(--color-text);
    }

    .dropdown-menu .routine:hover:not(.selected) {
      color: var(--color-link);
    }

    .dropdown-menu .routine.selected {
      color: #aaa;
      cursor: default;
    }

    h1 {
      margin: 0;
      font-size: var(--size-type-xxlarge);
      font-style: oblique;
    }

    .add-routine-button {
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }
    .icon {
      width: 24px;
      height: 24px;
      stroke: currentColor;
      stroke-width: 2;
      fill: none;
    }
    .list-item {
      display: flex;
      justify-content: space-between;
    }
    .confirmation {
      display: flex;
    }
    .confirm-delete,
    .cancel-delete,
    .delete-button {
      background: none;
      border: none;
      padding: 5px 10px;
      cursor: pointer;
      color: white;
      font-weight: bold;
    }
    .confirm-delete {
      background-color: #409238;
    }
    .cancel-delete {
      background-color: #d83b3b;
    }
    .confirm-delete:hover,
    .cancel-delete:hover,
    .add-routine-button:hover,
    .delete-button:hover {
      color: var(--color-link);
    }
    .delete-button {
      color: var(--color-text);
    }
    .delete-button:hover {
      background-color: #d83b3b;
    }
  `;
}
