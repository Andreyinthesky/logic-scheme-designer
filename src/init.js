import G6 from "./g6";
import {debounce} from "./utils";

let scale = 1.0;

export default function init() {
  const mountNode = document.getElementById("mountNode");

  const graph = new G6.Graph({
    container: "mountNode",
    width: mountNode.getBoundingClientRect().width,
    height: mountNode.getBoundingClientRect().height,
    maxZoom: 3,
    minZoom: 0.2,
    groupType: "rect",
    modes: {
      default: ["drag-node", "click-add-edge", "drag-canvas"],
      testScheme: ["change-input-state", "drag-canvas", "drag-node"],
    }
  });

  const canvasResize = debounce(() => {
    console.log("resize");
    const width = mountNode.getBoundingClientRect().width;
    const height = mountNode.getBoundingClientRect().height;

    graph.changeSize(width, height);
  });

  window.onresize = () => {
    canvasResize();
  }

  document.getElementById("fit-btn").addEventListener("click", evt => {
    console.log("try to move to (0,0)");
    const leftTopCorner = graph.getPointByCanvas(0, 0);
    graph.translate(leftTopCorner.x * scale, leftTopCorner.y * scale);
  });

  graph.on("node:mouseover", event => {
    console.log("hover node");
    // USE STATES
    let item = event.item;
    let group = item.getContainer();
    let children = group.get("children");
    for (let i = 0, len = children.length; i < len; i++) {
      let child = children[i];
      if (child._attrs && child.attr("name") === "anchor") {
        child.show();
      }
    }
    graph.paint();
  });

  graph.on("node:mouseout", event => {
    console.log("hover node");
    // USE STATES
    let item = event.item;
    let group = item.getContainer();
    let children = group.get("children");
    for (let i = 0, len = children.length; i < len; i++) {
      let child = children[i];
      if (child._attrs && child.attr("name") === "anchor") {
        child.hide();
      }
    }
    graph.paint();
  });

  graph.on("wheel", ev => {
    const { deltaY } = ev;
    if ((deltaY > 0 && scale <= graph.get("minZoom")) || (deltaY < 0 && scale >= graph.get("maxZoom")))
      return;
    scale = parseFloat((scale + (deltaY < 0 ? 0.1 : -0.1)).toFixed(2));
    console.log("scale", scale);
    graph.zoomTo(scale);
    const viewText = document.getElementById("show-scale");
    viewText.innerHTML =
      viewText.innerHTML.substring(0, viewText.innerHTML.indexOf(":") + 1) +
      " " +
      Math.round(scale * 100) +
      "%";
  });

  return graph;
}