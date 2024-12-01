import { ObjectId } from "mongoose";
import { Entry } from "./entry";

export interface Workout {
  _id: ObjectId;
  name: string;
  order: number;
  replacement: Replacement | null;
  routine: ObjectId;
  exercises: Array<Exercise>;
}

interface Replacement {
  week: number;
  day: number;
}

interface Exercise {
  exercise_ref: string;
  exercise_name: string;
  entries: Array<Entry>;
}
