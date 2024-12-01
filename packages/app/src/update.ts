// import { Auth, Update } from "@calpoly/mustang";
import { Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { ExerciseInfo } from "server/models";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>
  // TOOD: used later
  // user: Auth.User
) {
  switch (message[0]) {
    case "exercise/select":
      selectExercise(message[1]).then((exerciseInfo) =>
        apply((model) => ({ ...model, exerciseInfo }))
      );
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
