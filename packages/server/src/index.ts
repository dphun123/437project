import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import { LogPage } from "./pages";
import entries from "./routes/entries";
import exerciseInfo from "./routes/exercise-info";

connect("exercise-log");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
app.use(express.static(staticDir));

app.use(express.json());

app.use("/api/entry", entries);
app.use("/api/exercise", exerciseInfo);

app.get("/hi", (req: Request, res: Response) => {
  const page = new LogPage([]);
  res.set("Content-Type", "text/html").send(page.render());
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
