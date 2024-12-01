"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_express = __toESM(require("express"));
var import_mongo = require("./services/mongo");
var import_auth = __toESM(require("./routes/auth"));
var import_auth2 = require("./pages/auth");
var import_pages = require("./pages");
var import_entries = __toESM(require("./routes/entries"));
var import_exercise_info = __toESM(require("./routes/exercise-info"));
var import_filesystem = require("./services/filesystem");
var import_exercise_info_svc = __toESM(require("./services/exercise-info-svc"));
var import_entry_svc = __toESM(require("./services/entry-svc"));
var import_promises = __toESM(require("node:fs/promises"));
var import_path = __toESM(require("path"));
(0, import_mongo.connect)("exercise-log");
const app = (0, import_express.default)();
const port = process.env.PORT || 3e3;
const staticDir = process.env.STATIC || "public";
app.use(import_express.default.static(staticDir));
app.use(import_express.default.json());
app.use("/auth", import_auth.default);
app.post("/images", import_filesystem.saveFile);
app.get("/images/:id", import_filesystem.getFile);
app.use("/api/entry", import_auth.authenticateUser, import_entries.default);
app.use("/api/exercise", import_exercise_info.default);
app.get("/test", (req, res) => {
  const page = new import_pages.LogPage([]);
  res.set("Content-Type", "text/html").send(page.render());
});
app.get("/login", (req, res) => {
  const page = new import_auth2.LoginPage();
  res.set("Content-Type", "text/html").send(page.render());
});
app.get("/exercise/:ref", (req, res) => {
  const { ref } = req.params;
  import_exercise_info_svc.default.get(ref).then((data) => {
    if (!data) {
      return res.status(404).send(`Exercise '${ref}' not found.`);
    }
    const page = new import_pages.ExerciseInfoPage(data);
    res.set("Content-Type", "text/html").send(page.render());
  });
});
app.get("/entry/:_id", (req, res) => {
  const { _id } = req.params;
  import_entry_svc.default.getEntryById(_id).then((data) => {
    if (!data) {
      return res.status(404).send(`Entry '${_id}' not found.`);
    }
    const page = new import_pages.EntryPage(data);
    res.set("Content-Type", "text/html").send(page.render());
  });
});
app.use("/app", (req, res) => {
  const indexHtml = import_path.default.resolve(staticDir, "index.html");
  import_promises.default.readFile(indexHtml, { encoding: "utf8" }).then((html) => res.send(html));
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
