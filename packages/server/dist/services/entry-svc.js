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
var entry_svc_exports = {};
__export(entry_svc_exports, {
  default: () => entry_svc_default
});
module.exports = __toCommonJS(entry_svc_exports);
var import_mongoose = require("mongoose");
const EntrySchema = new import_mongoose.Schema(
  {
    exercise: { type: String, required: true },
    date_added: { type: Date, required: true, default: Date.now },
    sets: [
      {
        weight: { type: Number, required: true },
        repetitions: { type: Number, required: true }
      }
    ],
    comment: String,
    last_modified: { type: Date, default: Date.now }
  },
  { collection: "entry" }
);
const EntryModel = (0, import_mongoose.model)("Entry", EntrySchema);
function index() {
  return EntryModel.find();
}
function get(exercise) {
  return EntryModel.find({ exercise }).then((entries) => entries).catch((err) => {
    throw `$No entries for {exercise} found.`;
  });
}
function create(json) {
  const entry = new EntryModel(json);
  return entry.save();
}
function update(_id, entry) {
  return EntryModel.findOneAndUpdate({ _id }, entry, {
    new: true
  }).then((updated) => {
    if (!updated) throw `$Entry {_id} not updated.`;
    else return updated;
  });
}
function remove(_id) {
  return EntryModel.findOneAndDelete({ _id }).then((deleted) => {
    if (!deleted) throw `Entry ${_id} not deleted.`;
  });
}
var entry_svc_default = { index, get, create, update, remove };
