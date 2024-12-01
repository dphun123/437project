import { ObjectId } from "mongoose";

export interface Entry {
  _id: ObjectId;
  date_added: Date;
  sets: Set[];
  comment: string;
  last_modified: Date;
}

interface Set {
  weight: number;
  repetitions: number;
}
