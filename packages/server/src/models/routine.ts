import { ObjectId } from "mongoose";
import { Workout } from "./workout";

export interface Routine {
  _id: ObjectId;
  username: string;
  name: string;
  created_at: Date;
  workouts: Array<Workout>;
  latest_week: number;
}
