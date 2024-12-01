import { ObjectId } from "mongoose";
import { Workout } from "./workout";

export interface Routine {
  _id: ObjectId;
  name: string;
  created_at: Date;
  owner: ObjectId;
  workouts: Array<Workout>;
}
