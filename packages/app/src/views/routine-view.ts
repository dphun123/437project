import { View, History } from "@calpoly/mustang";
import { css, html } from "lit";
import { state } from "lit/decorators.js";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../styles/reset.css";
import { Workout, ExerciseInfo } from "server/models";

export class RoutineViewElement extends View<Model, Msg> {
  @state()
  routineName = "";

  @state()
  workouts: Workout[] = [];

  @state()
  currentWorkout: Workout = {
    _id: undefined,
    name: "",
    order: undefined,
    exercises: [],
  };

  @state()
  selectedExercise = "";

  @state()
  nameLocked = false;

  @state()
  get exerciseList(): ExerciseInfo[] | undefined {
    return this.model.exercises;
  }

  constructor() {
    super("log:model");
  }

  connectedCallback() {
    super.connectedCallback();
    this.dispatchMessage(["exercise/index", {}]);
  }

  createRoutine() {
    if (this.routineName && this.workouts.length > 0) {
      this.dispatchMessage([
        "routine/create",
        {
          name: this.routineName,
          workouts: this.workouts.map((workout, index) => ({
            _id: undefined,
            name: workout.name,
            order: index,
            exercises: workout.exercises.map((exercise) => ({
              exercise_ref: exercise.exercise_ref,
              exercise_name: exercise.exercise_name,
              entries: [],
            })),
          })) as Workout[],
          onSuccess: () => {
            this.dispatchMessage(["routine/list", {}]);
            History.dispatch(this, "history/navigate", {
              href: `/app/routine/${this.routineName}`,
            });
          },
          onFailure: (error: Error) => console.log("ERROR:", error),
        },
      ]);
    }
  }

  render() {
    return html`
      <main class="page">
        <section class="form">
          <section class="title"><h2>Create a Routine</h2></section>
          <section class="routine-name">
            <label>
              <input
                type="text"
                .value=${this.routineName}
                @input=${(e: InputEvent) =>
                  (this.routineName = (e.target as HTMLInputElement).value)}
                placeholder="Enter routine name"
              />
            </label>
          </section>
          <section>
            <h3>Add Workout</h3>
            <label>
              <input
                type="text"
                .value=${this.currentWorkout.name}
                @input=${this.updateWorkoutName}
                ?disabled=${this.nameLocked}
                placeholder="Enter workout name"
              />
            </label>
            <div class="exercise-selector">
              <select
                .value=${this.selectedExercise}
                @change=${(e: Event) =>
                  (this.selectedExercise = (
                    e.target as HTMLSelectElement
                  ).value)}
              >
                <option value="">Select Exercise</option>
                ${this.exerciseList?.map(
                  (exercise) =>
                    html`
                      <option value=${exercise.ref}>${exercise.name}</option>
                    `
                )}
              </select>
              <button
                @click=${this.addExerciseToWorkout}
                ?disabled=${!this.selectedExercise || !this.currentWorkout.name}
              >
                Add Exercise to Workout
              </button>
            </div>
            <button
              @click=${this.addWorkout}
              ?disabled=${!this.currentWorkout.name ||
              this.currentWorkout.exercises.length === 0}
            >
              Add Workout to Routine
            </button>
          </section>

          <section>
            <button
              @click=${this.createRoutine}
              ?disabled=${!this.routineName || this.workouts.length === 0}
            >
              Create Routine
            </button>
          </section>
        </section>
        <section class="current-workouts">
          <h2>Current Workouts</h2>
          <div class="workouts-box">
            ${this.workouts.map(
              (workout, index) => html`
                <div class="workout">
                  <div class="workout-header">
                    <h3>Workout #${index + 1}: ${workout.name}</h3>
                  </div>
                  <ul>
                    ${workout.exercises.map(
                      (exercise, exIndex) => html`
                        <li>
                          ${exercise.exercise_name}
                          <button
                            class="delete-button"
                            @click=${() => this.deleteExercise(index, exIndex)}
                          >
                            X
                          </button>
                        </li>
                      `
                    )}
                  </ul>
                </div>
              `
            )}
          </div>
        </section>
      </main>
    `;
  }

  updateWorkoutName(e: InputEvent) {
    const workoutName = (e.target as HTMLInputElement).value;
    this.currentWorkout = {
      ...this.currentWorkout,
      name: workoutName,
    };
    this.nameLocked = this.currentWorkout.exercises.length > 0;
  }

  addExerciseToWorkout() {
    const exercise = this.exerciseList?.find(
      (e) => e.ref === this.selectedExercise
    );
    if (exercise && this.currentWorkout.name) {
      const updatedWorkout = {
        ...this.currentWorkout,
        exercises: [
          ...this.currentWorkout.exercises,
          {
            exercise_ref: exercise.ref,
            exercise_name: exercise.name,
            entries: [],
          },
        ],
      };
      this.currentWorkout = updatedWorkout;
      this.nameLocked = true;
      const existingWorkoutIndex = this.workouts.findIndex(
        (w) => w.name === this.currentWorkout.name
      );

      if (existingWorkoutIndex !== -1) {
        this.workouts = this.workouts.map((workout, index) =>
          index === existingWorkoutIndex ? updatedWorkout : workout
        );
      } else {
        this.workouts = [...this.workouts, updatedWorkout];
      }

      this.selectedExercise = "";
    }
    console.log(this.workouts);
  }

  deleteExercise(workoutIndex: number, exerciseIndex: number) {
    const updatedWorkouts = this.workouts
      .map((workout, wIndex) => {
        if (wIndex === workoutIndex) {
          const updatedExercises = workout.exercises.filter(
            (_, eIndex) => eIndex !== exerciseIndex
          );
          return updatedExercises.length > 0
            ? { ...workout, exercises: updatedExercises }
            : null;
        }
        return workout;
      })
      .filter(Boolean) as Workout[];

    this.workouts = updatedWorkouts;
    if (workoutIndex === -1 || this.workouts.length === 0) {
      this.nameLocked = false;
    }
  }

  addWorkout() {
    if (this.currentWorkout.name && this.currentWorkout.exercises.length > 0) {
      const existingWorkoutIndex = this.workouts.findIndex(
        (w) => w.name === this.currentWorkout.name
      );

      if (existingWorkoutIndex !== -1) {
        this.workouts = this.workouts.map((workout, index) =>
          index === existingWorkoutIndex ? { ...this.currentWorkout } : workout
        );
      } else {
        this.workouts = [...this.workouts, { ...this.currentWorkout }];
      }
      this.currentWorkout = {
        _id: undefined,
        name: "",
        exercises: [],
        order: undefined,
      };
      this.nameLocked = false;
    }
  }

  static styles = [
    reset.styles,
    css`
      main {
        margin-top: 3rem;
        display: flex;
        justify-content: center;
        gap: 2rem;
        background-color: var(--color-background-page);
        color: var(--color-text);
        font-family: var(--font-family-body);
        font-weight: var(--font-weight-normal);
        line-height: var(--font-line-height-body);
        font-size: var(--size-type-body);
      }
      h2 {
        font-size: var(--size-type-xlarge);

        color: var(--color-link);
        padding: 0.5rem;
        font-family: var(--font-family-display);
        font-weight: var(--font-weight-bold);
        line-height: var(--font-line-height-display);
      }
      h3 {
        font-size: var(--size-type-large);
        color: var(--color-link);
      }
      .page > section {
        margin: 0 var(--size-spacing-large) var(--size-spacing-large)
          var(--size-spacing-large);
      }
      .form {
        width: 50%;
      }
      .form section {
        margin-bottom: 2rem;
      }
      .title {
        display: flex;
        justify-content: center;
        margin-bottom: 0rem !important;
      }
      input,
      select {
        width: 100%;
        margin: 0.5rem 0;
        padding: 0.5rem;
      }

      button {
        width: 100%;
        padding: 0.75rem;
        margin: 0.5rem 0;
        background-color: var(--color-accent);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      button:disabled {
        background-color: #ddd;
        cursor: default;
      }

      .current-workouts {
        border: var(--size-border) solid var(--color-accent);
        width: 40%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .current-workouts > h2 {
        text-align: center;
        margin-top: 0.5rem;
      }
      .workouts-box {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--size-spacing-medium);
        width: 100%;
        padding: 0 var(--size-spacing-medium);
      }

      .workout {
        border: 1px solid #eee;
        padding: var(--size-spacing-small);
      }
      .workout ul {
        list-style-type: disc;
        padding-left: 1.5rem;
      }

      .exercise-selector {
        display: flex;
        flex-direction: column;
        gap: 0.5px;
      }

      .delete-button {
        background-color: #ff4d4d;
        color: white;
        border: none;
        border-radius: 3px;
        width: 15px;
        height: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
      .workout li {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    `,
  ];
}
