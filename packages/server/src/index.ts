import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import auth, { authenticateUser } from "./routes/auth";
import { LoginPage } from "./pages/auth";
import { LogPage, EntryPage, ExerciseInfoPage } from "./pages";
import entries from "./routes/entries";
import exerciseInfo from "./routes/exercise-info";
import AllExerciseInfo from "./services/exercise-info-svc";
import Entries from "./services/entry-svc";
import fs from "node:fs/promises";
import path from "path";

connect("exercise-log");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
app.use(express.static(staticDir));

app.use(express.json());

app.use("/auth", auth);
app.use("/api/entry", authenticateUser, entries);
app.use("/api/exercise", exerciseInfo);

app.get("/test", (req: Request, res: Response) => {
  // const name = "ppl";
  // Routines.get(name).then((data) => {
  //   if (!data) {
  //     // set up landing page instead
  //     const page = new LogPage([]);
  //     res.set("Content-Type", "text/html").send(page.render());
  //   } else {
  //     const page = new LogPage(data);
  //     res.set("Content-Type", "text/html").send(page.render());
  //   }
  // });
  const page = new LogPage([]);
  res.set("Content-Type", "text/html").send(page.render());
});

app.get("/login", (req: Request, res: Response) => {
  const page = new LoginPage();
  res.set("Content-Type", "text/html").send(page.render());
});

app.get("/exercise/:ref", (req: Request, res: Response) => {
  const { ref } = req.params;
  AllExerciseInfo.get(ref).then((data) => {
    if (!data) {
      return res.status(404).send(`Exercise '${ref}' not found.`);
    }
    const page = new ExerciseInfoPage(data);
    res.set("Content-Type", "text/html").send(page.render());
  });
});

app.get("/entry/:_id", (req: Request, res: Response) => {
  const { _id } = req.params;
  Entries.getEntryById(_id).then((data) => {
    if (!data) {
      return res.status(404).send(`Entry '${_id}' not found.`);
    }
    const page = new EntryPage(data);
    res.set("Content-Type", "text/html").send(page.render());
  });
});

app.use("/app", (req: Request, res: Response) => {
  const indexHtml = path.resolve(staticDir, "index.html");
  fs.readFile(indexHtml, { encoding: "utf8" }).then((html) => res.send(html));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
