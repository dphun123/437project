import express, { Request, Response } from "express";
import { Entry } from "../models";
import Entries from "../services/entry-svc";

const router = express.Router();

// router.get("/", (_, res: Response) => {
//   Entries.index()
//     .then((list: Entry[]) => res.json(list))
//     .catch((err) => res.status(500).send(err));
// });

router.get("/:_id", (req: Request, res: Response) => {
  const { _id } = req.params;
  Entries.get(_id)
    .then((entry) => {
      if (!entry) {
        return res.status(404).send(`No entry with id '${_id}' found.`);
      }
      // if (entry.username !== req.username) {
      //   return res
      //     .status(403)
      //     .send("You do not have permission to access this entry.");
      // }
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

  Entries.update(_id, newEntry)
    .then((entry: Entry) => res.json(entry))
    .catch((err) => res.status(404).end());
});

// router.delete("/:_id", (req: Request, res: Response) => {
//   const { _id } = req.params;

//   Entries.remove(_id)
//     .then(() => res.status(204).end())
//     .catch((err) => res.status(404).send(err));
// });

export default router;
