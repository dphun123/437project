import { ExerciseInfo, Routine, Entry } from "server/models";

export interface Model {
  exerciseInfo?: ExerciseInfo;
  exercises?: ExerciseInfo[];
  routine?: Routine;
  routineNames?: string[];
  entry?: Entry;
}

export const init: Model = {};
