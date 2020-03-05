import changeInputState from "./changeInputState";
import clickAddEdge from "./clickAddEdge";

const behaviours = {
  "change-input-state": changeInputState,
  "click-add-edge": clickAddEdge,
}

export default function registerBehaviors(G6) {
  Object.entries(behaviours)
    .forEach(([name, cfg]) => G6.registerBehavior(name, cfg));
}