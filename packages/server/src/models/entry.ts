import { ObjectId } from "mongoose";

export interface Entry {
  _id: ObjectId | undefined;
  date_added: Date;
  week: number;
  sets: Set[];
  comment: string;
  last_modified: Date;
}

export interface Set {
  weight: number;
  repetitions: number;
}
