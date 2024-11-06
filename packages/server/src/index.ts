import express, { Request, Response } from "express";
import { ExerciseInfoPage } from "./pages/exercise-info";
import { getExerciseInfo } from "./services/exercise-info-svc";
import { connect } from "./services/mongo";

connect("exercise-log");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

app.get("/exercise/:name", (req: Request, res: Response) => {
  const { name } = req.params;
  const data = getExerciseInfo(name);
  const page = new ExerciseInfoPage(data);

  console.log(page);
  res.set("Content-Type", "text/html").send(page.render());
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
