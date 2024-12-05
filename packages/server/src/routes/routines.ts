import express, { Request, Response } from "express";
import { Routine } from "../models";
import Routines from "../services/routine-svc";

const router = express.Router();

router.get("/:username", (req: Request, res: Response) => {
  const { username } = req.params;
  Routines.getAllNames(username)
    .then((list: string[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:username/:name", (req: Request, res: Response) => {
  const { username, name } = req.params;
  Routines.getByName(username, name)
    .then((routine) => {
      if (!routine) {
        return res
          .status(404)
          .send(`No routine called '${name}' by ${username} found.`);
      }
      // if (routine.username !== req.username) {
      //   return res
      //     .status(403)
      //     .send("You do not have permission to access this routine.");
      // }
      res.json(routine);
    })
    .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newRoutine = req.body;

  Routines.create(newRoutine)
    .then((routine: Routine) => res.status(201).json(routine))
    .catch((err) => res.status(500).send(err));
});

router.put("/:_id", (req: Request, res: Response) => {
  const { _id } = req.params;
  const newRoutine = req.body;
  Routines.update(_id, newRoutine)
    .then((routine: Routine) => res.json(routine))
    .catch((err) => res.status(404).end());
});

router.delete("/:name", (req: Request, res: Response) => {
  const { name } = req.params;

  Routines.remove(name)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
