import { ObjectId } from "mongoose";

export interface Routine {
  _id: ObjectId;
  name: string;
  created_at: Date;
  owner: ObjectId;
  workouts: ObjectId[];
}
