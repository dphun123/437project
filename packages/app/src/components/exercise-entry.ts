import { View } from "@calpoly/mustang";
import { html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { Routine, Entry, Set } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
// import { Types } from "mongoose";

function getEntry(
  routine: Routine | undefined,
  workoutName: string | undefined,
  exerciseName: string | undefined
): Entry {
  const targetWorkout = routine?.workouts.find(
    (workout) => workout.name === workoutName
  );
  if (!targetWorkout) {
    throw new Error("Workout not found in routine.");
  }
  const targetExercise = targetWorkout.exercises.find(
    (exercise) => exercise.exercise_name === exerciseName
  );
  if (!targetExercise) {
    throw new Error("Exercise not found in workout.");
  }
  return (
    targetExercise.entries[0] || {
      week: routine?.latest_week,
      sets: [],
      comment: "",
    }
  );
}

export class EntryElement extends View<Model, Msg> {
  @state()
  routine?: Routine;

  @property()
  workoutId?: string;

  @property()
  workoutName?: string;

  @property()
  exerciseName?: string;

  @property()
  exerciseRef?: string;

  @state()
  entry?: Entry;

  @state()
  isAddingSet = false;

  @state()
  isEditingComment = false;

  @state()
  editingSetIndex: number | null = null;

  @state()
  get newEntry(): Entry | undefined {
    return this.model.entry;
  }

  constructor() {
    super("log:model");
  }

  saveEntry() {
    console.log(this.entry);
    this.dispatchMessage([
      "entry/update",
      {
        routine: this.routine,
        workoutId: this.workoutId,
        exerciseName: this.exerciseName,
        entry: this.entry,
        onSuccess: () => {},
        onFailure: (error: Error) => console.log("ERROR:", error),
      },
    ]);
  }

  render() {
    this.entry = getEntry(this.routine, this.workoutName, this.exerciseName);
    const { sets, comment } = {
      sets: this.renderSets(this.entry?.sets),
      comment: this.renderComment(this.entry?.comment),
    };
    return html`
      <section class="exercise">
        <dt>
          <a href="/app/exercise/${this.exerciseRef}"> ${this.exerciseName} </a>
          ${comment}
        </dt>
        <dd>${sets}</dd>
      </section>
    `;
  }

  renderSets(sets: Set[]) {
    return html`
      <table class="sets-table">
        <thead>
          <tr>
            <th>Set</th>
            <th>Weight</th>
            <th>Reps</th>
          </tr>
        </thead>
        <tbody>
          ${sets?.map(
            (set, index) => html`
              <tr @click=${() => this.startEditingSet(index)}>
                <td>${index + 1}</td>
                <td>${set.weight}</td>
                <td>${set.repetitions}</td>
              </tr>
            `
          )}
          ${this.isAddingSet || this.editingSetIndex !== null
            ? html`
                <tr class="adding-set">
                  <td>
                    ${this.editingSetIndex !== null
                      ? this.editingSetIndex + 1
                      : sets?.length
                      ? sets.length + 1
                      : 1}
                  </td>
                  <td>
                    <input
                      type="number"
                      id="new-weight"
                      placeholder="Weight"
                      .value=${this.editingSetIndex !== null
                        ? sets[this.editingSetIndex].weight.toString()
                        : ""}
                      @keydown=${this.handleInputKeyDown}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      id="new-reps"
                      placeholder="Reps"
                      .value=${this.editingSetIndex !== null
                        ? sets[this.editingSetIndex].repetitions.toString()
                        : ""}
                      @keydown=${this.handleInputKeyDown}
                    />
                  </td>
                </tr>
              `
            : html`
                <tr class="add-set-row">
                  <td colspan="3">
                    <button
                      @click=${this.startAddingSet}
                      class="add-set-button"
                    >
                      <svg viewBox="0 0 24 24" class="icon">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                  </td>
                </tr>
              `}
        </tbody>
      </table>
    `;
  }

  startEditingSet(index: number) {
    this.isAddingSet = true;
    this.editingSetIndex = index;
    setTimeout(() => {
      const repsInput = this.shadowRoot?.getElementById(
        "new-reps"
      ) as HTMLInputElement;
      const weightInput = this.shadowRoot?.getElementById(
        "new-weight"
      ) as HTMLInputElement;

      repsInput?.addEventListener("blur", this.handleInputBlur);
      weightInput?.addEventListener("blur", this.handleInputBlur);
      repsInput?.addEventListener("focus", this.handleInputFocus);
      weightInput?.addEventListener("focus", this.handleInputFocus);
      weightInput?.focus();
    }, 0);
  }

  // when + is pressed
  startAddingSet() {
    this.isAddingSet = true;
    this.editingSetIndex = null;
    setTimeout(() => {
      const repsInput = this.shadowRoot?.getElementById(
        "new-reps"
      ) as HTMLInputElement;
      const weightInput = this.shadowRoot?.getElementById(
        "new-weight"
      ) as HTMLInputElement;

      repsInput?.addEventListener("blur", this.handleInputBlur);
      weightInput?.addEventListener("blur", this.handleInputBlur);
      repsInput?.addEventListener("focus", this.handleInputFocus);
      weightInput?.addEventListener("focus", this.handleInputFocus);
      weightInput?.focus();
    }, 0);
  }

  // allows for cancel/submit with esc/enter
  handleInputKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      this.saveNewSet();
    } else if (e.key === "Escape") {
      this.cancelAddSet();
    }
  }

  // logic for clicking off input
  handleInputBlur = (_: FocusEvent) => {
    setTimeout(() => {
      const repsInput = this.shadowRoot?.getElementById(
        "new-reps"
      ) as HTMLInputElement;
      const weightInput = this.shadowRoot?.getElementById(
        "new-weight"
      ) as HTMLInputElement;
      if (!repsInput?.matches(":focus") && !weightInput?.matches(":focus")) {
        // if both have values, save
        if (repsInput.value && weightInput.value) {
          this.saveNewSet();
        }
        // if both empty, cancel
        else if (!repsInput.value && !weightInput.value) {
          this.cancelAddSet();
        }
      }
    }, 100);
  };

  // stops cancel when switching between inputs
  handleInputFocus = (e: FocusEvent) => {
    e.stopPropagation();
  };

  cancelAddSet() {
    const repsInput = this.shadowRoot?.getElementById(
      "new-reps"
    ) as HTMLInputElement;
    const weightInput = this.shadowRoot?.getElementById(
      "new-weight"
    ) as HTMLInputElement;
    repsInput?.removeEventListener("blur", this.handleInputBlur);
    weightInput?.removeEventListener("blur", this.handleInputBlur);
    repsInput?.removeEventListener("focus", this.handleInputFocus);
    weightInput?.removeEventListener("focus", this.handleInputFocus);
    if (repsInput) repsInput.value = "";
    if (weightInput) weightInput.value = "";
    this.isAddingSet = false;
    this.editingSetIndex = null;
  }

  saveNewSet() {
    const repsInput = this.shadowRoot?.getElementById(
      "new-reps"
    ) as HTMLInputElement;
    const weightInput = this.shadowRoot?.getElementById(
      "new-weight"
    ) as HTMLInputElement;
    repsInput?.removeEventListener("blur", this.handleInputBlur);
    weightInput?.removeEventListener("blur", this.handleInputBlur);
    repsInput?.removeEventListener("focus", this.handleInputFocus);
    weightInput?.removeEventListener("focus", this.handleInputFocus);

    const reps = parseInt(repsInput.value);
    const weight = parseFloat(weightInput.value);
    if (!isNaN(reps) && !isNaN(weight)) {
      if (this.editingSetIndex !== null) {
        // Editing existing set
        if (this.entry?.sets) {
          if (reps === 0) {
            this.entry.sets.splice(this.editingSetIndex, 1);
          } else {
            this.entry.sets[this.editingSetIndex] = {
              repetitions: reps,
              weight: weight,
            };
          }
        }
      } else {
        // Adding new set
        if (!(reps === 0)) {
          this.entry?.sets.push({ repetitions: reps, weight: weight });
        }
      }
      this.saveEntry();
      this.isAddingSet = false;
      this.editingSetIndex = null;
    }
  }

  renderComment(comment?: string) {
    return html`
      <div class="comment-container">
        <button class="comment-button" @click=${this.toggleCommentEdit}>
          <svg viewBox="0 0 24 24" class="icon ${comment ? "filled" : ""}">
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            ></path>
          </svg>
          ${this.isEditingComment
            ? html`
                <input
                  type="text"
                  class="comment-input"
                  .value=${comment || ""}
                  @keydown=${this.handleCommentKeyDown}
                  @blur=${this.saveComment}
                />
              `
            : comment
            ? html`<span class="comment-tooltip">${comment}</span>`
            : ""}
        </button>
      </div>
    `;
  }

  toggleCommentEdit = () => {
    this.isEditingComment = true;
    setTimeout(() => {
      const commentInput = this.shadowRoot?.querySelector(
        ".comment-input"
      ) as HTMLInputElement;
      commentInput?.focus();
    }, 0);
  };

  handleCommentKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      this.saveComment();
    } else if (e.key === "Escape") {
      this.isEditingComment = false;
    }
  };

  saveComment = () => {
    const commentInput = this.shadowRoot?.querySelector(
      ".comment-input"
    ) as HTMLInputElement;
    if (this.entry && commentInput) {
      this.entry.comment = commentInput.value;
      this.saveEntry();
    }
    this.isEditingComment = false;
  };

  static styles = css`
    a {
      color: var(--color-link);
      width: 100%;
      flex-grow: 1;
      text-align: center;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    dt {
      display: flex;
      align-items: center;
      width: 100%;
      position: relative;
      font-weight: var(--font-weight-darker);
      font-size: var(--size-type-medium);
      align-items: center;
      gap: 0.5rem;
    }
    .comment-container {
      margin-left: auto;
    }
    dd {
      margin: 0;
    }
    .icon {
      width: 16px;
      height: 16px;
      stroke: currentColor;
      stroke-width: 2;
      fill: none;
    }

    .sets-table {
      width: 100%;
      border-collapse: collapse;
      color: rgb(51 51 51);
    }
    .sets-table th,
    .sets-table td {
      padding: 0.5rem;
      text-align: center;
      border: 1px solid #ddd;
    }
    .sets-table th {
      background-color: #f4f4f4;
      font-weight: bold;
    }
    .sets-table tr:nth-child(even) {
      background-color: #f4f4f4;
    }
    .sets-table tr:nth-child(odd) {
      background-color: #ede8f5;
    }
    .sets-table tr:hover {
      background-color: #f1f1f1;
    }

    .add-set-row {
      background-color: #f4f4f4;
    }
    .add-set-button {
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      opacity: 0.5;
      transition: opacity 0.2s;
    }
    .add-set-button:hover {
      opacity: 0.6;
    }
    .add-set-button .icon {
      width: 24px;
      height: 24px;
    }

    .adding-set input {
      width: 100%;
      padding: 0.25rem;
      text-align: center;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    }

    .comment-button {
      background: none;
      border: none;
      position: relative;
      color: var(--color-text);
      cursor: pointer;
    }
    .comment-tooltip {
      display: none;
      position: absolute;
      transform: translateX(-50%);
      background-color: #f4f4f4;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 0.5rem;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      white-space: nowrap;
      max-width: 250px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .comment-button:hover .comment-tooltip {
      display: block;
    }
    .filled {
      fill: var(--color-accent);
    }
    .comment-input {
      color: rgb(51 51 51);
      position: absolute;
      transform: translateX(-50%);
      background-color: #f4f4f4;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 0.5rem;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      white-space: nowrap;
      max-width: 250px;
      z-index: 10;
    }
  `;
}
