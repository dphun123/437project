import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { ExerciseInfo, Routine, Entry, Workout } from "server/models";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "exercise/select":
      selectExercise(message[1]).then((exerciseInfo) =>
        apply((model) => ({ ...model, exerciseInfo }))
      );
      break;
    case "exercise/index":
      listExercises().then((exercises) =>
        apply((model) => ({ ...model, exercises }))
      );
      break;
    case "routine/list":
      listRoutines(user).then((routineNames) =>
        apply((model) => ({ ...model, routineNames }))
      );
      break;
    case "routine/select":
      selectRoutine(message[1], user).then((routine) =>
        apply((model) => ({ ...model, routine }))
      );
      break;
    case "routine/create":
      createRoutine(message[1], user)
        .then((routine) => apply((model) => ({ ...model, routine })))
        .then(() => {
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((error: Error) => {
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      break;
    case "routine/delete":
      deleteRoutine(message[1], user)
        .then(() => {
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((error: Error) => {
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      break;
    case "routine/updateWeek":
      updateWeek(message[1], user)
        .then((routine) => apply((model) => ({ ...model, routine })))
        .then(() => {
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((error: Error) => {
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      break;
    case "entry/update":
      updateEntry(message[1], user)
        .then((routine) => apply((model) => ({ ...model, routine })))
        .then(() => {
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((error: Error) => {
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      break;
    // put the rest of your cases here
    default:
      const unhandled: never = message[0];
      throw new Error(`Unhandled Auth message "${unhandled}"`);
  }
}

function selectExercise(msg: { ref: string }) {
  return fetch(`/api/exercise/${msg.ref}`)
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Exercise Info:", json);
        return json as ExerciseInfo;
      }
    });
}

function listExercises() {
  return fetch(`/api/exercise`)
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Exercises:", json);
        return json as ExerciseInfo[];
      }
    });
}

function listRoutines(user: Auth.User) {
  return fetch(`/api/routine/${user.username}`, {
    headers: Auth.headers(user),
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Routines:", json);
        return json as string[];
      }
    });
}

function selectRoutine(msg: { name: string }, user: Auth.User) {
  return fetch(`/api/routine/${user.username}/${msg.name}`, {
    headers: Auth.headers(user),
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Routine:", json);
        return json as Routine;
      }
    });
}

function createRoutine(
  msg: {
    name: string;
    workouts: Workout[];
  },
  user: Auth.User
) {
  return fetch(`/api/routine`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user),
    },
    body: JSON.stringify({
      username: user.username,
      name: msg.name,
      workouts: msg.workouts,
    }),
  })
    .then((response: Response) => {
      if (response.status === 201) return response.json();
      else throw new Error(`Failed to create routine for ${user.username}`);
    })
    .then((json: unknown) => {
      if (json) return json as Routine;
      return undefined;
    });
}

function deleteRoutine(
  msg: {
    name: string | undefined;
  },
  user: Auth.User
) {
  return fetch(`/api/routine/${msg.name}`, {
    method: "DELETE",
    headers: {
      ...Auth.headers(user),
    },
  }).then((response: Response) => {
    if (response.status === 204) return;
    else throw new Error(`Failed to create routine for ${user.username}`);
  });
}

function updateWeek(
  msg: {
    routine: Routine | undefined;
  },
  user: Auth.User
) {
  return fetch(`/api/routine/${msg.routine?._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user),
    },
    body: JSON.stringify(msg.routine),
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      else
        throw new Error(
          `Failed to update week in ${msg.routine?.name} for ${user.username}`
        );
    })
    .then((json: unknown) => {
      if (json) return json as Routine;
      return undefined;
    });
}

// function createEntry(
//   msg: {
//     routine: Routine | undefined;
//     workoutName: string | undefined;
//     exerciseName: string | undefined;
//     entry: Entry | undefined;
//   },
//   user: Auth.User
// ) {
//   return fetch(`/api/entry`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       ...Auth.headers(user),
//     },
//     body: JSON.stringify(msg.entry),
//   })
//     .then((response: Response) => {
//       console.log(response);
//       if (response.status === 201) {
//         return response.json();
//       } else {
//         throw new Error(`Failed to create entry for ${user.username}`);
//       }
//     })
//     .then((createdEntry) => {
//       const workout = msg.routine?.workouts.find(
//         (w) => w.name === msg.workoutName
//       );
//       if (!workout) {
//         throw new Error(`Workout ${msg.workoutName} not found in routine`);
//       }
//       const updatedWorkout = {
//         ...workout,
//         exercises: workout.exercises.map((exercise) => {
//           if (exercise.exercise_name === msg.exerciseName) {
//             exercise.entries.push(createdEntry._id);
//           }
//           return exercise;
//         }),
//       };
//       return fetch(`/api/workout/${workout._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           ...Auth.headers(user),
//         },
//         body: JSON.stringify(updatedWorkout),
//       });
//     })
//     .then((response) => {
//       if (response.status === 200) {
//         return msg.routine;
//       } else {
//         throw new Error(`Failed to update workout with new entry`);
//       }
//     });
// }

// function updateEntry(
//   msg: {
//     routine: Routine | undefined;
//     workoutId: string | undefined;
//     exerciseName: string | undefined;
//     entry: Entry | undefined;
//   },
//   user: Auth.User
// ) {
//   return fetch(`/api/entry/${msg.entry?._id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       ...Auth.headers(user),
//     },
//     body: JSON.stringify(msg.entry),
//   }).then((response: Response) => {
//     if (response.status === 200)
//       return fetch(`/api/routine/${user.username}/${msg.routine?.name}`, {
//         headers: Auth.headers(user),
//       })
//         .then((response: Response) => {
//           if (response.status === 200) {
//             return response.json();
//           }
//           return undefined;
//         })
//         .then((json: unknown) => {
//           if (json) {
//             console.log("Routine:", json);
//             return json as Routine;
//           }
//         });
//     else throw new Error(`Failed to update entry for ${user.username}`);
//   });
// }

function updateEntry(
  msg: {
    routine: Routine | undefined;
    workoutId: string | undefined;
    exerciseName: string | undefined;
    entry: Entry | undefined;
  },
  user: Auth.User
) {
  const method = msg.entry?._id ? "PUT" : "POST";
  const url = method === "PUT" ? `/api/entry/${msg.entry?._id}` : `/api/entry`;
  // post entry if no id, else put
  return fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user),
    },
    body: JSON.stringify(msg.entry),
  }).then((response: Response) => {
    // if put, get new routine
    if (response.status === 200)
      return fetch(`/api/routine/${user.username}/${msg.routine?.name}`, {
        headers: Auth.headers(user),
      })
        .then((response: Response) => {
          if (response.status === 200) return response.json();
          return undefined;
        })
        .then((json: unknown) => {
          if (json) {
            console.log("Routine:", json);
            return json as Routine;
          }
        });
    // if post, put workout
    else if (response.status === 201) {
      // console.log("HERE", response);
      return response.json().then((json: unknown) => {
        console.log("HERE", json);
        const newEntry = json as Entry;
        return fetch(
          `/api/workout/addEntry/${msg.exerciseName}/${msg.workoutId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...Auth.headers(user),
            },
            body: JSON.stringify({ entryId: newEntry._id }),
          }
        ).then((response: Response) => {
          if (response.status === 200)
            return fetch(`/api/routine/${user.username}/${msg.routine?.name}`, {
              headers: Auth.headers(user),
            })
              .then((response: Response) => {
                if (response.status === 200) return response.json();
                return undefined;
              })
              .then((json: unknown) => {
                if (json) {
                  console.log("Routine:", json);
                  return json as Routine;
                }
              });
          else
            throw new Error(
              `Failed to update workout with entry for ${user.username}`
            );
        });
      });
    } else throw new Error(`Failed to create entry for ${user.username}`);
  });
}
