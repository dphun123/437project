"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var routine_svc_exports = {};
__export(routine_svc_exports, {
  default: () => routine_svc_default
});
module.exports = __toCommonJS(routine_svc_exports);
var import_mongoose = require("mongoose");
var import_workout_svc = require("./workout-svc");
const RoutineSchema = new import_mongoose.Schema(
  {
    username: { type: String, required: true },
    name: { type: String, required: true },
    created_at: { type: Date, required: true, default: Date.now },
    workouts: [{ type: import_mongoose.Schema.Types.ObjectId, ref: "Workout" }],
    latest_week: { type: Number, default: 1 }
  },
  {
    collection: "routine"
  }
);
RoutineSchema.index({ username: 1, name: 1 }, { unique: true });
const RoutineModel = (0, import_mongoose.model)("Routine", RoutineSchema);
function index() {
  return RoutineModel.find();
}
function getAllNames(username) {
  return RoutineModel.find({ username }).then((routines) => {
    if (!routines || routines.length === 0) {
      return [];
    }
    return routines.map((routine) => routine.name);
  }).catch(() => {
    return [];
  });
}
function getByName(username, name) {
  return RoutineModel.findOne({ username, name }).populate({
    path: "workouts"
  }).then((routine) => {
    if (!routine) return null;
    return RoutineModel.populate(routine, {
      path: "workouts.exercises.entries",
      match: { week: routine.latest_week }
    });
  }).catch((err) => {
    throw `No routine with name ${name} found or error processing routine: ${err}`;
  });
}
function create(json) {
  return RoutineModel.findOne({
    username: json.username,
    name: json.name
  }).then((existingRoutine) => {
    if (existingRoutine)
      throw new Error(
        `Routine with name "${json.name}" already exists for user "${json.username}".`
      );
    const workoutPromises = json.workouts.map((workout) => {
      const newWorkout = new import_workout_svc.WorkoutModel(workout);
      return newWorkout.save();
    });
    return Promise.all(workoutPromises).then((savedWorkouts) => {
      const workoutIds = savedWorkouts.map((workout) => workout._id);
      const routineWithWorkouts = new RoutineModel({
        ...json,
        workouts: workoutIds
      });
      return routineWithWorkouts.save();
    }).catch((err) => {
      throw new Error(`Error creating routine: ${err}`);
    });
  });
}
function update(_id, routine) {
  return RoutineModel.findOneAndUpdate({ _id }, routine, { new: true }).then((updated) => {
    if (!updated) throw `Routine ${_id} not updated.`;
    return RoutineModel.populate(updated, {
      path: "workouts",
      populate: {
        path: "exercises",
        populate: {
          path: "entries",
          match: { week: updated.latest_week }
        }
      }
    });
  }).catch((err) => {
    throw `Error updating routine ${_id}: ${err}`;
  });
}
function remove(name) {
  return RoutineModel.findOneAndDelete({ name }).then((deleted) => {
    if (!deleted) throw `Routine ${name} not deleted.`;
  });
}
var routine_svc_default = {
  index,
  getAllNames,
  getByName,
  create,
  update,
  remove
};
