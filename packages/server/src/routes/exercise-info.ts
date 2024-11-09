import express, { Request, Response } from "express";
import { ExerciseInfo } from "../models";
import AllExerciseInfo from "../services/exercise-info-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  AllExerciseInfo.index()
    .then((list: ExerciseInfo[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:ref", (req: Request, res: Response) => {
  const { ref } = req.params;

  AllExerciseInfo.get(ref)
    .then((data) => {
      if (!data) {
        return res.status(404).send(`Exercise '${ref}' not found.`);
      }
      res.json(data);
    })
    .catch((err) => res.status(404).send(err));
});

export default router;
