import G6 from "./g6";

import EditorObjIndexer from "./indexer";
import { EDITOR_EDITING_MODE, EDITOR_SIMULATION_MODE } from "./model/constants";


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
      [EDITOR_EDITING_MODE]: ["drag-node", "click-add-edge", "drag-canvas"],
      [EDITOR_SIMULATION_MODE]: ["change-input-state", "drag-canvas", "drag-node"],
    }
  });

  graph.indexer = new EditorObjIndexer();

  return graph;
}