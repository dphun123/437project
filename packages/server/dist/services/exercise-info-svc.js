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
  getExerciseInfo: () => getExerciseInfo
});
module.exports = __toCommonJS(exercise_info_svc_exports);
const exerciseInfo = {
  barbellSquat: {
    name: "Barbell Squat",
    description: "The barbell back squat is a popular compound movement that emphasizes building the lower-body muscle groups and overall strength. It's the classic way to start a leg day, and is a worthy centerpiece to a lower-body training program. The squat is a competitive lift in the sport of powerlifting, but is also a classic measurement of lower-body strength. With the barbell racked on the traps or upper back, the emphasis is placed on the posterior chain but the entire body gets worked. The back squat can be trained in everything from heavy singles to sets of 20 reps or higher.",
    muscles: ["Quadriceps", "Hamstrings", "Glutes"],
    type: ["Strength", "Powerlifting"],
    mechanic: "Compound",
    level: "Intermediate",
    instructions: [
      "Begin with the barbell supported on top of the traps. The chest should be up and the head facing forward. Adopt a hip-width stance with the feet turned out as needed.",
      "Descend by flexing the knees, refraining from moving the hips back as much as possible. This requires that the knees travel forward. Ensure that they stay aligned with the feet. The goal is to keep the torso as upright as possible.",
      "Continue all the way down, keeping the weight on the front of the heel. At the moment the upper legs contact the lower legs, reverse the motion, driving the weight upward."
    ],
    images: ["/images/squat.jpg", "/images/squat2.jpg"]
  },
  benchPress: {
    /* no data */
  }
};
function getExerciseInfo(exerciseName) {
  return exerciseInfo["barbellSquat"];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getExerciseInfo
});
