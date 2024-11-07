import express, { Request, Response } from "express";
import { ExerciseInfoPage } from "./pages/exercise-info";
import ExerciseInfo from "./services/exercise-info-svc";
import { connect } from "./services/mongo";

connect("exercise-log");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

app.get("/exercise/:name", (req: Request, res: Response) => {
  const { name } = req.params;

  ExerciseInfo.get(name).then((data) => {
    if (!data) {
      return res.status(404).send(`Exercise '${name}' not found.`);
    }
    const page = new ExerciseInfoPage(data);
    res.set("Content-Type", "text/html").send(page.render());
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
