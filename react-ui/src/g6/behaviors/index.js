import changeInputState from "./changeInputState";
import addWire from "./addWire";
import customDragCanvas from "./customDragCanvas";
import customDragNode from "./customDragNode";
import contextMenu from "./contextMenu";
import selectItems from "./selectItems";

const behaviours = {
  "change-input-state": changeInputState,
  "add-wire": addWire,
  "custom-drag-canvas": customDragCanvas,
  "custom-drag-node": customDragNode,
  "context-menu": contextMenu,
  "select-items": selectItems,
}

export default function registerBehaviors(G6) {
  Object.entries(behaviours)
    .forEach(([name, cfg]) => G6.registerBehavior(name, cfg));
}