import G6 from "../g6";
import Grid from "../../lib/g6/grid";

import EditorObjIndexer from "./schemeEditor/indexer";
import { EDITOR_EDITING_MODE, EDITOR_SIMULATION_MODE } from "./constants";


export default function init(mountNode) {
  const graph = new G6.Graph({
    container: "mountNode",
    width: mountNode.getBoundingClientRect().width,
    height: mountNode.getBoundingClientRect().height,
    maxZoom: 3,
    minZoom: 0.2,
    groupType: "rect",
    layout: {
      type: "schemeLayout"
    },
    modes: {
      [EDITOR_EDITING_MODE]: ["drag-node", "items-control", "custom-drag-canvas"],
      [EDITOR_SIMULATION_MODE]: ["change-input-state", "custom-drag-canvas", "drag-node"],
    },
    plugins: [new Grid()]
  });

  graph.indexer = new EditorObjIndexer();
  graph.setMode(EDITOR_EDITING_MODE);

  return graph;
}