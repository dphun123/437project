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
var log_exports = {};
__export(log_exports, {
  LogPage: () => LogPage
});
module.exports = __toCommonJS(log_exports);
var import_server = require("@calpoly/mustang/server");
var import_renderPage = __toESM(require("./renderPage"));
class LogPage {
  data;
  constructor(data) {
    this.data = data;
  }
  render() {
    return (0, import_renderPage.default)({
      body: this.renderBody(),
      stylesheets: ["/styles/log.css"],
      styles: [],
      scripts: [
        `import { define } from "@calpoly/mustang";
      import { ExerciseEntriesElement } from "/scripts/exercise-entries.js";
      define({
        "exercise-entries": ExerciseEntriesElement,
      });
      `
      ]
    });
  }
  renderBody() {
    return import_server.html`
      <body class="page-grid">
        <my-header>
          <span slot="left">
            <h1>PPL Routine</h1>
          </span>
          <span slot="right">
            <p><a href="/user/dennis.html">Dennis</a>' Workout Log</p>
          </span>
        </my-header>
        <section class="log">
          ${this.renderWorkoutSection("legs", "Legs", [
      { name: "Squat", link: "squat" },
      { name: "Leg Press", link: "leg-press" },
      { name: "Glute-Ham Raise", link: "ghr" },
      { name: "Leg Extension", link: "leg-extension" },
      { name: "Leg Curl", link: "leg-curl" }
    ])}
          ${this.renderWorkoutSection("push", "Push", [
      { name: "Bench Press", link: "bench-press" }
    ])}
          ${this.renderWorkoutSection("pull", "Pull", [
      { name: "Pull-up", link: "pull-up" }
    ])}
        </section>
      </body>
    `;
  }
  renderWorkoutSection(ref, title, exercises) {
    return import_server.html`
      <section class="workout">
        <h2>
          <a href="/workout/${ref}.html">${title}</a>
          <svg class="icon">
            <use href="/icons/workouts.svg#icon-${ref}" />
          </svg>
        </h2>
        <section class="exercises">
          <dl>
            ${exercises.map(
      (exercise) => import_server.html`
                  <exercise-entries
                    src="/api/entry/${exercise.link}"
                    link=${exercise.link}
                  >
                    ${exercise.name}
                  </exercise-entries>
                `
    )}
          </dl>
        </section>
      </section>
    `;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LogPage
});
