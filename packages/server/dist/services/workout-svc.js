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
var workout_svc_exports = {};
__export(workout_svc_exports, {
  WorkoutModel: () => WorkoutModel,
  default: () => workout_svc_default
});
module.exports = __toCommonJS(workout_svc_exports);
var import_mongoose = require("mongoose");
const ReplacementSchema = new import_mongoose.Schema({
  week: { type: Number, required: true },
  day: { type: Number, required: true }
});
const ExerciseSchema = new import_mongoose.Schema({
  exercise_ref: { type: String, required: true },
  exercise_name: { type: String, required: true },
  entries: [{ type: import_mongoose.Schema.Types.ObjectId, ref: "Entry" }]
});
const WorkoutSchema = new import_mongoose.Schema(
  {
    name: { type: String, required: true },
    order: { type: Number, required: true },
    // replacement: [ReplacementSchema],
    exercises: [ExerciseSchema]
  },
  { collection: "workout" }
);
const WorkoutModel = (0, import_mongoose.model)("Workout", WorkoutSchema);
function index() {
  return WorkoutModel.find();
}
function get(_id) {
  return WorkoutModel.findOne({ _id }).populate({
    path: "exercises.entries",
    model: "Entry"
  }).then((workout) => workout).catch((err) => {
    throw `No workout with id ${_id} found.`;
  });
}
function create(json) {
  const workout = new WorkoutModel(json);
  return workout.save();
}
function update(_id, workout) {
  return WorkoutModel.findOneAndUpdate({ _id }, workout, {
    new: true
  }).then((updated) => {
    if (!updated) throw `Workout {_id} not updated.`;
    else return updated;
  });
}
function addEntry(workoutId, exerciseName, entryId) {
  return WorkoutModel.findOneAndUpdate(
    { _id: workoutId, "exercises.exercise_name": exerciseName },
    {
      $push: { "exercises.$.entries": entryId }
    },
    { new: true }
  ).then((updated) => {
    if (!updated) throw `Workout with ID ${workoutId} not updated.`;
    return updated;
  });
}
function remove(_id) {
  return WorkoutModel.findOneAndDelete({ _id }).then((deleted) => {
    if (!deleted) throw `Workout ${_id} not deleted.`;
  });
}
var workout_svc_default = {
  index,
  get,
  create,
  update,
  addEntry,
  remove
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WorkoutModel
});
