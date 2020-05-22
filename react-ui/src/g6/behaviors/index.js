import changeInputState from "./changeInputState";
import itemsControl from "./itemsControl";

const behaviours = {
  "change-input-state": changeInputState,
  "items-control": itemsControl,
}

export default function registerBehaviors(G6) {
  Object.entries(behaviours)
    .forEach(([name, cfg]) => G6.registerBehavior(name, cfg));
}