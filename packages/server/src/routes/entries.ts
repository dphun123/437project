import express, { Request, Response } from "express";
import { Entry } from "../models";
import Entries from "../services/entry-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Entries.index()
    .then((list: Entry[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:exercise", (req: Request, res: Response) => {
  const { exercise } = req.params;

  Entries.get(exercise)
    .then((entries) => {
      if (!entries || entries.length === 0) {
        return res.status(404).send(`No entries for '${exercise}' found.`);
      }
      res.json(entries);
    })
    .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newEntry = req.body;

  Entries.create(newEntry)
    .then((entry: Entry) => res.status(201).json(entry))
    .catch((err) => res.status(500).send(err));
});

router.put("/:_id", (req: Request, res: Response) => {
  const { _id } = req.params;
  const newEntry = req.body;
  // TODO: make sure to include lastModified in newentry

  Entries.update(_id, newEntry)
    .then((entry: Entry) => res.json(entry))
    .catch((err) => res.status(404).end());
});

router.delete("/:_id", (req: Request, res: Response) => {
  const { _id } = req.params;

  Entries.remove(_id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
