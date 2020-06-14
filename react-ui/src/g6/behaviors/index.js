import changeInputState from "./changeInputState";
import itemsControl from "./itemsControl";
import customDragCanvas from "./customDragCanvas";

const behaviours = {
  "change-input-state": changeInputState,
  "items-control": itemsControl,
  "custom-drag-canvas": customDragCanvas
}

export default function registerBehaviors(G6) {
  Object.entries(behaviours)
    .forEach(([name, cfg]) => G6.registerBehavior(name, cfg));
}