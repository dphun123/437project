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
var entries_exports = {};
__export(entries_exports, {
  default: () => entries_default
});
module.exports = __toCommonJS(entries_exports);
var import_express = __toESM(require("express"));
var import_entry_svc = __toESM(require("../services/entry-svc"));
const router = import_express.default.Router();
router.get("/:_id", (req, res) => {
  const { _id } = req.params;
  import_entry_svc.default.get(_id).then((entry) => {
    if (!entry) {
      return res.status(404).send(`No entry with id '${_id}' found.`);
    }
    res.json(entry);
  }).catch((err) => res.status(404).send(err));
});
router.post("/", (req, res) => {
  const newEntry = req.body;
  import_entry_svc.default.create(newEntry).then((entry) => res.status(201).json(entry)).catch((err) => res.status(500).send(err));
});
router.put("/:_id", (req, res) => {
  const { _id } = req.params;
  const newEntry = req.body;
  import_entry_svc.default.update(_id, newEntry).then((entry) => res.json(entry)).catch((err) => res.status(404).end());
});
var entries_default = router;
