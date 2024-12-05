import { Schema, model } from "mongoose";
import { Routine, Entry } from "../models";
import { WorkoutModel } from "./workout-svc";

const RoutineSchema = new Schema<Routine>(
  {
    username: { type: String, required: true },
    name: { type: String, required: true },
    created_at: { type: Date, required: true, default: Date.now },
    workouts: [{ type: Schema.Types.ObjectId, ref: "Workout" }],
    latest_week: { type: Number, default: 1 },
  },
  {
    collection: "routine",
  }
);

RoutineSchema.index({ username: 1, name: 1 }, { unique: true });

const RoutineModel = model<Routine>("Routine", RoutineSchema);

function index(): Promise<Routine[]> {
  return RoutineModel.find();
}

function getAllNames(username: String): Promise<string[]> {
  return RoutineModel.find({ username })
    .then((routines) => {
      if (!routines || routines.length === 0) {
        return [];
      }
      return routines.map((routine) => routine.name);
    })
    .catch(() => {
      return [];
    });
}

function getByName(username: String, name: String): Promise<Routine | null> {
  return RoutineModel.findOne({ username, name })
    .populate({
      path: "workouts",
    })
    .then((routine) => {
      if (!routine) return null;
      return RoutineModel.populate(routine, {
        path: "workouts.exercises.entries",
        match: { week: routine.latest_week },
      });
    })
    .catch((err) => {
      throw `No routine with name ${name} found or error processing routine: ${err}`;
    });
}

function create(json: Routine): Promise<Routine> {
  return RoutineModel.findOne({
    username: json.username,
    name: json.name,
  }).then((existingRoutine) => {
    if (existingRoutine)
      throw new Error(
        `Routine with name "${json.name}" already exists for user "${json.username}".`
      );
    const workoutPromises = json.workouts.map((workout) => {
      const newWorkout = new WorkoutModel(workout);
      return newWorkout.save();
    });
    return Promise.all(workoutPromises)
      .then((savedWorkouts) => {
        const workoutIds = savedWorkouts.map((workout) => workout._id);
        const routineWithWorkouts = new RoutineModel({
          ...json,
          workouts: workoutIds,
        });
        return routineWithWorkouts.save();
      })
      .catch((err) => {
        throw new Error(`Error creating routine: ${err}`);
      });
  });
}

function update(_id: String, routine: Routine): Promise<Routine> {
  return RoutineModel.findOneAndUpdate({ _id }, routine, { new: true })
    .then((updated) => {
      if (!updated) throw `Routine ${_id} not updated.`;
      return RoutineModel.populate(updated, {
        path: "workouts",
        populate: {
          path: "exercises",
          populate: {
            path: "entries",
            match: { week: updated.latest_week },
          },
        },
      });
    })
    .catch((err) => {
      throw `Error updating routine ${_id}: ${err}`;
    });
}

function remove(name: String): Promise<void> {
  return RoutineModel.findOneAndDelete({ name }).then((deleted) => {
    if (!deleted) throw `Routine ${name} not deleted.`;
  });
}

export default {
  index,
  getAllNames,
  getByName,
  create,
  update,
  remove,
};
