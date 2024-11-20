import express, { Request, Response } from "express";
import { Entry } from "../models";
import Entries from "../services/entry-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Entries.index()
    .then((list: Entry[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/exercise/:exercise_ref", (req: Request, res: Response) => {
  const { exercise_ref } = req.params;

  Entries.getEntriesByExercise("Dennis", exercise_ref)
    .then((entries) => {
      if (!entries || entries.length === 0) {
        return res.status(404).send(`No entries for '${exercise_ref}' found.`);
      }
      res.json(entries);
    })
    .catch((err) => res.status(404).send(err));
});

router.get("/:_id", (req: Request, res: Response) => {
  const { _id } = req.params;
  console.log("hello");
  Entries.getEntryById(_id)
    .then((entry) => {
      if (!entry) {
        return res.status(404).send(`No entry with id '${_id}' found.`);
      }
      console.log(entry.username);
      console.log(req.user);
      if (entry.username !== req.user) {
        return res
          .status(403)
          .send("You do not have permission to access this entry.");
      }
      res.json(entry);
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
