import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import auth, { authenticateUser } from "./routes/auth";
import exerciseInfo from "./routes/exercise-info";
import entries from "./routes/entries";
import workouts from "./routes/workouts";
import routines from "./routes/routines";
import { getFile, saveFile } from "./services/filesystem";
import fs from "node:fs/promises";
import path from "path";

connect("exercise-log");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
app.use(express.static(staticDir));

app.use(express.json());

app.use("/auth", auth);

app.post("/images", saveFile);
app.get("/images/:id", getFile);

app.use("/api/exercise", exerciseInfo);
app.use("/api/entry", authenticateUser, entries);
app.use("/api/workout", authenticateUser, workouts);
app.use("/api/routine", authenticateUser, routines);
// app.use("/api/entry", entries);
// app.use("/api/workout", workouts);
// app.use("/api/routine", routines);

app.use("/app", (req: Request, res: Response) => {
  const indexHtml = path.resolve(staticDir, "index.html");
  fs.readFile(indexHtml, { encoding: "utf8" }).then((html) => res.send(html));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
