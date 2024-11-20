import { ObjectId } from "mongoose";

export interface Entry {
  _id: ObjectId;
  username: string;
  exercise_ref: string;
  exercise_name: string;
  date_added: Date;
  sets: Set[];
  comment: string;
  last_modified: Date;
}

export interface Set {
  weight: number;
  repetitions: number;
}
