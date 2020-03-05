import G6 from "./g6";

export default function init() {
  const mountNode = document.getElementById("mountNode");

  return new G6.Graph({
    container: "mountNode",
    width: mountNode.offsetWidth,
    height: 400,
    maxZoom: 3,
    minZoom: 0.2,
    groupType: "rect",
    modes: {
      default: ["drag-node", "click-add-edge", ],
      testScheme: ["change-input-state", ],
    }
  });
}