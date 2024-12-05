import { Routine, Entry, Workout } from "server/models";
export type Msg =
  | ["exercise/index", {}]
  | ["exercise/select", { ref: string }]
  | ["routine/list", {}]
  | ["routine/select", { username: string; name: string }]
  | [
      "routine/create",
      {
        name: string;
        workouts: Workout[];
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]
  | [
      "routine/delete",
      {
        name: string | undefined;
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]
  | [
      "routine/updateWeek",
      {
        routine: Routine | undefined;
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]
  | [
      "entry/update",
      {
        routine: Routine | undefined;
        workoutId: string | undefined;
        exerciseName: string | undefined;
        entry: Entry | undefined;
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ];
