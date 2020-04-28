import G6 from "./g6";

import EditorObjIndexer from "./indexer";

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
      default: ["drag-node", "click-add-edge", "drag-canvas"],
      testScheme: ["change-input-state", "drag-canvas", "drag-node"],
    }
  });

  graph.indexer = new EditorObjIndexer();

  return graph;
}