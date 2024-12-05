"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var routines_exports = {};
__export(routines_exports, {
  default: () => routines_default
});
module.exports = __toCommonJS(routines_exports);
var import_express = __toESM(require("express"));
var import_routine_svc = __toESM(require("../services/routine-svc"));
const router = import_express.default.Router();
router.get("/:username", (req, res) => {
  const { username } = req.params;
  import_routine_svc.default.getAllNames(username).then((list) => res.json(list)).catch((err) => res.status(500).send(err));
});
router.get("/:username/:name", (req, res) => {
  const { username, name } = req.params;
  import_routine_svc.default.getByName(username, name).then((routine) => {
    if (!routine) {
      return res.status(404).send(`No routine called '${name}' by ${username} found.`);
    }
    res.json(routine);
  }).catch((err) => res.status(404).send(err));
});
router.post("/", (req, res) => {
  const newRoutine = req.body;
  import_routine_svc.default.create(newRoutine).then((routine) => res.status(201).json(routine)).catch((err) => res.status(500).send(err));
});
router.put("/:_id", (req, res) => {
  const { _id } = req.params;
  const newRoutine = req.body;
  import_routine_svc.default.update(_id, newRoutine).then((routine) => res.json(routine)).catch((err) => res.status(404).end());
});
router.delete("/:name", (req, res) => {
  const { name } = req.params;
  import_routine_svc.default.remove(name).then(() => res.status(204).end()).catch((err) => res.status(404).send(err));
});
var routines_default = router;