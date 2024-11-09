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
var exercise_info_svc_exports = {};
__export(exercise_info_svc_exports, {
  default: () => exercise_info_svc_default
});
module.exports = __toCommonJS(exercise_info_svc_exports);
var import_mongoose = require("mongoose");
const ExerciseInfoSchema = new import_mongoose.Schema(
  {
    ref: { type: String, required: true, trim: true },
    name: String,
    description: String,
    muscles: [String],
    type: [String],
    mechanic: String,
    level: String,
    instructions: [String],
    images: [String]
  },
  { collection: "exercise-info" }
);
const ExerciseInfoModel = (0, import_mongoose.model)("Info", ExerciseInfoSchema);
function index() {
  return ExerciseInfoModel.find();
}
function get(ref) {
  return ExerciseInfoModel.findOne({ ref }).then((exerciseInfo) => exerciseInfo).catch((err) => {
    throw `${ref} Not Found`;
  });
}
var exercise_info_svc_default = { index, get };
