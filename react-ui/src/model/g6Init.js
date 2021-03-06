import G6 from "../g6";
import Grid from "../../lib/g6/grid";

import ItemIndexer from "./schemeEditor/ItemIndexer";
import { EDITOR_EDITING_MODE, EDITOR_SIMULATION_MODE } from "./constants";


function syncGridPositionByGraphTranlatePatch(graph) {
  const oldTranslateFn = graph.translate;

  function syncGridPositionByCanvas(graph) {
    const { x: xOrigin, y: yOrigin } = graph.getCanvasByPoint(0, 0);
    const scale = graph.getZoom();
    const gridPosition = { x: xOrigin / scale, y: yOrigin / scale };
    document.querySelector(".g6-grid").style.backgroundPosition = `${gridPosition.x}px ${gridPosition.y}px`;
  }

  graph.translate = function () {
    oldTranslateFn.apply(graph, arguments);
    syncGridPositionByCanvas(graph);
  }
}

export default function init(mountNode) {
  const graph = new G6.Graph({
    container: mountNode,
    width: mountNode.getBoundingClientRect().width,
    height: mountNode.getBoundingClientRect().height,
    maxZoom: 3,
    minZoom: 0.2,
    groupType: "rect",
    layout: {
      type: "schemeLayout"
    },
    modes: {
      [EDITOR_EDITING_MODE]: ["custom-drag-node", "add-wire", "select-items",  "custom-drag-canvas", "context-menu"],
      [EDITOR_SIMULATION_MODE]: ["change-input-state", "custom-drag-canvas", "custom-drag-node"],
    },
    plugins: [new Grid()]
  });

  syncGridPositionByGraphTranlatePatch(graph);

  graph.indexer = new ItemIndexer();
  graph.setMode(EDITOR_EDITING_MODE);

  return graph;
}