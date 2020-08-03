import changeInputState from "./changeInputState";
import itemsControl from "./itemsControl";
import customDragCanvas from "./customDragCanvas";
import customDragNode from "./customDragNode";

const behaviours = {
  "change-input-state": changeInputState,
  "items-control": itemsControl,
  "custom-drag-canvas": customDragCanvas,
  "custom-drag-node": customDragNode,
}

export default function registerBehaviors(G6) {
  Object.entries(behaviours)
    .forEach(([name, cfg]) => G6.registerBehavior(name, cfg));
}