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
var exercise_info_exports = {};
__export(exercise_info_exports, {
  ExerciseInfoPage: () => ExerciseInfoPage
});
module.exports = __toCommonJS(exercise_info_exports);
var import_server = require("@calpoly/mustang/server");
var import_renderPage = __toESM(require("./renderPage"));
class ExerciseInfoPage {
  data;
  constructor(data) {
    this.data = data;
  }
  render() {
    return (0, import_renderPage.default)({
      body: this.renderBody(),
      stylesheets: ["/styles/exercise.css"],
      styles: [],
      scripts: [
        `import { define } from "@calpoly/mustang";
      import { ExerciseInfoElement } from "/scripts/exercise-info.js";
      define({
        "exercise-info": ExerciseInfoElement,
      });
      `
      ]
    });
  }
  renderBody() {
    const exerciseInfo = this.renderExerciseInfo(this.data);
    return import_server.html`
      <body class="page-grid">
        <my-header>
          <span slot="left">
            <a href="/workout/legs.html">&larr; Legs Workout</a>
          </span>
        </my-header>
        ${exerciseInfo}
      </body>
    `;
  }
  renderExerciseInfo(exerciseInfo) {
    const {
      name,
      description,
      muscles,
      type,
      mechanic,
      level,
      instructions,
      images
    } = exerciseInfo;
    const instructionsList = instructions ? import_server.html`
          <ol>
            ${instructions.map((instruction) => import_server.html`<li>${instruction}</li>`)}
          </ol>
        ` : import_server.html`<p>"No instructions.</p>`;
    const imagesList = images ? import_server.html`
          ${images.map(
      (image) => import_server.html`<img src=${image} style="width: 400px; height: auto" />`
    )}
        ` : "";
    return import_server.html`
      <exercise-info>
        <span slot="name">${name || "Exercise"}</span>
        <span slot="description">
          ${description || "No description found."}
        </span>
        <span slot="muscles">${muscles.join(", ") || "N/A"}</span> <br />
        <span slot="type">${type.join(", ") || "N/A"}</span>
        <span slot="mechanic"> ${mechanic || "N/A"} </span>
        <span slot="level">${level || "N/A"}</span>
        <span slot="instructions"> ${instructionsList} </span>
        <span slot="images">${imagesList}</span>
      </exercise-info>
    `;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ExerciseInfoPage
});
