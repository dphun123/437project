import express, { Request, Response } from "express";
import { Workout } from "../models";
import Workouts from "../services/workout-svc";

const router = express.Router();

// router.get("/", (_, res: Response) => {
//   Workouts.index()
//     .then((list: Workout[]) => res.json(list))
//     .catch((err) => res.status(500).send(err));
// });

router.get("/:_id", (req: Request, res: Response) => {
  const { _id } = req.params;
  Workouts.get(_id)
    .then((workout) => {
      if (!workout) {
        return res.status(404).send(`No workout with id '${_id}' found.`);
      }
      // if (workout.username !== req.username) {
      //   return res
      //     .status(403)
      //     .send("You do not have permission to access this workout.");
      // }
      res.json(workout);
    })
    .catch((err) => res.status(404).send(err));
});

// // TODO: order
// router.post("/", (req: Request, res: Response) => {
//   const newWorkout = req.body;

//   Workouts.create(newWorkout)
//     .then((workout: Workout) => res.status(201).json(workout))
//     .catch((err) => res.status(500).send(err));
// });

router.put("/:_id", (req: Request, res: Response) => {
  const { _id } = req.params;
  const newWorkout = req.body;
  Workouts.update(_id, newWorkout)
    .then((workout: Workout) => res.json(workout))
    .catch((err) => res.status(404).end());
});

router.put("/addEntry/:exercise_name/:_id", (req: Request, res: Response) => {
  const { _id, exercise_name } = req.params;
  const { entryId } = req.body;
  console.log("HERE");
  Workouts.addEntry(_id, exercise_name, entryId)
    .then((workout: Workout) => res.json(workout))
    .catch((err) => res.status(404).end());
});

// // TODO: update order
// router.delete("/:_id", (req: Request, res: Response) => {
//   const { _id } = req.params;

//   Workouts.remove(_id)
//     .then(() => res.status(204).end())
//     .catch((err) => res.status(404).send(err));
// });

export default router;
