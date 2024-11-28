import { Auth, History, Switch, define } from "@calpoly/mustang";
import { html } from "lit";
import { HeaderElement } from "./components/my-header";
import { LoginFormElement } from "./components/login-form";
import { LogViewElement } from "./views/log-view";
import { ExerciseViewElement } from "./views/exercise-view";

const routes: Switch.Route[] = [
  {
    path: "/app/exercise/:ref",
    view: (params: Switch.Params) => html`
      <exercise-view ref=${params.ref}></exercise-view>
    `,
  },
  {
    auth: "protected",
    path: "/app",
    view: () => html` <log-view></log-view> `,
  },
  {
    path: "/",
    redirect: "/app",
  },
];

define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "log:history", "log:auth");
    }
  },
  "my-header": HeaderElement,
  "login-form": LoginFormElement,
  "log-view": LogViewElement,
  "exercise-view": ExerciseViewElement,
});
