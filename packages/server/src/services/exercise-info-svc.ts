import { Schema, model } from "mongoose";
import { ExerciseInfo } from "../models";

const ExerciseInfoSchema = new Schema<ExerciseInfo>(
  {
    ref: { type: String, required: true, trim: true },
    name: String,
    description: String,
    muscles: [String],
    type: [String],
    mechanic: String,
    level: String,
    instructions: [String],
    images: [String],
  },
  { collection: "exercise-info" }
);

const ExerciseInfoModel = model<ExerciseInfo>("Info", ExerciseInfoSchema);

function index(): Promise<ExerciseInfo[]> {
  return ExerciseInfoModel.find();
}

function get(ref: String): Promise<ExerciseInfo | null> {
  return ExerciseInfoModel.findOne({ ref })
    .then((exerciseInfo) => exerciseInfo)
    .catch((err) => {
      throw `${ref} Not Found`;
    });
}

export default { index, get };
