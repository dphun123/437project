import { ObjectId } from "mongoose";

export interface Workout {
  _id: ObjectId;
  name: string;
  order: number;
  replacement: Replacement | null;
  routine: ObjectId;
  exercises: ObjectId[];
}

interface Replacement {
  week: number;
  day: number;
}
