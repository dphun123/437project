import { ObjectId } from "mongoose";
import { Entry } from "./entry";

export interface Workout {
  _id: ObjectId | undefined;
  name: string;
  order: number | undefined;
  // replacement: Replacement | null;
  exercises: Array<Exercise>;
}

export interface Replacement {
  week: number;
  day: number;
}

export interface Exercise {
  exercise_ref: string;
  exercise_name: string;
  entries: Array<Entry>;
}
