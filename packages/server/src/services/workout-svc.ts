import { Schema, model } from "mongoose";
import { Workout, Replacement, Exercise } from "../models";

const ReplacementSchema = new Schema<Replacement>({
  week: { type: Number, required: true },
  day: { type: Number, required: true },
});

const ExerciseSchema = new Schema<Exercise>({
  exercise_ref: { type: String, required: true },
  exercise_name: { type: String, required: true },
  entries: [{ type: Schema.Types.ObjectId, ref: "Entry" }],
});

const WorkoutSchema = new Schema<Workout>(
  {
    name: { type: String, required: true },
    order: { type: Number, required: true },
    // replacement: [ReplacementSchema],
    exercises: [ExerciseSchema],
  },
  { collection: "workout" }
);

const WorkoutModel = model<Workout>("Workout", WorkoutSchema);

function index(): Promise<Workout[]> {
  return WorkoutModel.find();
}

function get(_id: String): Promise<Workout | null> {
  return WorkoutModel.findOne({ _id })
    .populate({
      path: "exercises.entries",
      model: "Entry",
    })
    .then((workout) => workout)
    .catch((err) => {
      throw `No workout with id ${_id} found.`;
    });
}

function create(json: Workout): Promise<Workout> {
  const workout = new WorkoutModel(json);
  return workout.save();
}

function update(_id: String, workout: Workout): Promise<Workout> {
  return WorkoutModel.findOneAndUpdate({ _id }, workout, {
    new: true,
  }).then((updated) => {
    if (!updated) throw `Workout {_id} not updated.`;
    else return updated as Workout;
  });
}

function addEntry(
  workoutId: string,
  exerciseName: string,
  entryId: string
): Promise<Workout> {
  return WorkoutModel.findOneAndUpdate(
    { _id: workoutId, "exercises.exercise_name": exerciseName },
    {
      $push: { "exercises.$.entries": entryId },
    },
    { new: true }
  ).then((updated) => {
    if (!updated) throw `Workout with ID ${workoutId} not updated.`;
    return updated as Workout;
  });
}

function remove(_id: String): Promise<void> {
  return WorkoutModel.findOneAndDelete({ _id }).then((deleted) => {
    if (!deleted) throw `Workout ${_id} not deleted.`;
  });
}

export default {
  index,
  get,
  create,
  update,
  addEntry,
  remove,
};

export { WorkoutModel };
