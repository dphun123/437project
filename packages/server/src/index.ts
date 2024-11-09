import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import { ExerciseInfoPage, LogPage } from "./pages";
import entries from "./routes/entries";
import exerciseInfo from "./routes/exercise-info";
import AllExerciseInfo from "./services/exercise-info-svc";
import Entries from "./services/entry-svc";

connect("exercise-log");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
app.use(express.static(staticDir));

app.use(express.json());

app.use("/api/entry", entries);
app.use("/api/exercise", exerciseInfo);

app.get("/", (req: Request, res: Response) => {
  // const user = "Dennis";
  // Exercises.get(user).then((data) => {
  //   if (!data) {
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
