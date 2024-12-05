import { Auth, History, Switch, Store, define } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";
import { html } from "lit";
import { HeaderElement } from "./components/my-header";
import { LoginFormElement } from "./components/login-form";
import { LogViewElement } from "./views/log-view";
import { ExerciseViewElement } from "./views/exercise-view";
import { RoutineViewElement } from "./views/routine-view";

const routes: Switch.Route[] = [
  {
    path: "/app/exercise/:ref",
    view: (params: Switch.Params) => html`
      <exercise-view exerciseRef=${params.ref}></exercise-view>
    `,
  },
  {
    auth: "protected",
    path: "/app/routine/:name",
    view: (params: Switch.Params) => html`
      <log-view name=${params.name}></log-view>
    `,
  },
  {
    auth: "protected",
    path: "/app/routine",
    view: () => html` <routine-view></routine-view>`,
  },
  {
    // TODO: add a home view
    auth: "protected",
    path: "/app",
    view: () => html` <home-view></home-view> `,
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
  "mu-store": class AppStore extends Store.Provider<Model, Msg> {
    constructor() {
      super(update, init, "log:auth");
    }
  },
  "my-header": HeaderElement,
  "login-form": LoginFormElement,
  "log-view": LogViewElement,
  "exercise-view": ExerciseViewElement,
  "routine-view": RoutineViewElement,
});
