import "./index.css";
import init from "./init.js";

import AND_GATE from "./assets/svg_elements/AND_ANSI.svg";
import BUFFER_GATE from "./assets/svg_elements/Buffer_ANSI.svg";
import NAND_GATE from "./assets/svg_elements/NAND_ANSI.svg";
import NOR_GATE from "./assets/svg_elements/NOR_ANSI.svg";
import NOT_GATE from "./assets/svg_elements/NOT_ANSI.svg";
import OR_GATE from "./assets/svg_elements/OR_ANSI.svg";
import XNOR_GATE from "./assets/svg_elements/XNOR_ANSI.svg";
import XOR_GATE from "./assets/svg_elements/XOR_ANSI.svg";

let scale = 1.0;

const graphData = {
  nodes: [
    {
      id: "node1",
      shape: "image",
      x: 250,
      y: 300,
      size: [100, 50],
      anchorPoints: [[1, 0.5], [0, 0.685], [0, 0.315]],
      img: AND_GATE,
      style: {
        cursor: "move"
      }
    },
    {
      id: "node2",
      shape: "image",
      x: 100,
      y: 200,
      size: [100, 50],
      anchorPoints: [[1, 0.5], [0, 0.5]],
      img: NOT_GATE,
      style: {
        cursor: "move"
      }
    },
  ]
};

const graph = init();

graph.read(graphData);

graph.getNodes().forEach((n, i) => {
  addAnchors(n);
});

function addAnchors(node) {
  const model = node.getModel();

  if (!model.anchorPoints) return;

  const group = node.getContainer();
  const id = model.id;
  for (let i = 0; i < model.anchorPoints.length; i++) {
    let { x, y } = node.getLinkPointByAnchor(i);
    let anchor = group.addShape("marker", {
      id: id + "_anchor_bg_" + i,
      attrs: {
        boxName: "anchor",
        name: "anchor",
        x: x - model.x,
        y: y - model.y,
        r: 5,
        fill: "#f00"
      }
    });
    anchor.hide();
  }
}

graph.paint();

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

graph.on("click", ev => {
  console.log("click canvas");
});

let dragCanvas = false;
let dragCanvasCoord;
graph.on("canvas:mousedown", ev => {
  dragCanvas = true;
  dragCanvasCoord = { x: ev.x, y: ev.y };
});

graph.on("mousemove", ev => {
  if (!dragCanvas || !dragCanvasCoord) return;
  console.log("drag canvas");
  graph.translate((ev.x - dragCanvasCoord.x) * scale, (ev.y - dragCanvasCoord.y) * scale);
});

graph.on("mouseup", ev => {
  console.log("end drag");
  dragCanvas = false;
});

graph.on("canvas:mouseout", ev => {
  console.log("end drag");
  dragCanvas = false;
});

document.getElementById("fit-btn").addEventListener("click", event => {
  console.log("try to move to (0,0)");
  const leftTopCorner = graph.getPointByCanvas(0, 0);
  graph.translate(leftTopCorner.x * scale, leftTopCorner.y * scale);
});

let nodeId = 5;
document.getElementById("select-gate").addEventListener("click", event => {
  let nodeData = {};
  switch (event.target.id) {
    case "buffer":
      nodeData.img = BUFFER_GATE;
      nodeData.anchorPoints = [[1, 0.5], [0, 0.5]];
      break;
    case "and":
      nodeData.img = AND_GATE;
      nodeData.anchorPoints = [[1, 0.5], [0, 0.685], [0, 0.315]];
      break;
    case "or":
      nodeData.img = OR_GATE;
      nodeData.anchorPoints = [[1, 0.5], [0, 0.685], [0, 0.315]];
      break;
    case "xor":
      nodeData.img = XOR_GATE;
      nodeData.anchorPoints = [[1, 0.5], [0, 0.685], [0, 0.315]];
      break;
    case "not":
      nodeData.img = NOT_GATE;
      nodeData.anchorPoints = [[1, 0.5], [0, 0.5]];
      break;
    case "nand":
      nodeData.img = NAND_GATE;
      nodeData.anchorPoints = [[1, 0.5], [0, 0.685], [0, 0.315]];
      break;
    case "nor":
      nodeData.img = NOR_GATE;
      nodeData.anchorPoints = [[1, 0.5], [0, 0.685], [0, 0.315]];
      break;
    case "nxor":
      nodeData.img = XNOR_GATE;
      nodeData.anchorPoints = [[1, 0.5], [0, 0.685], [0, 0.315]];
      break;
    default:
      return;
  }
  nodeData.id = "node" + nodeId++;
  nodeData.shape = "image";
  let { x, y } = graph.getPointByCanvas(100, 100);
  nodeData.x = x;
  nodeData.y = y;
  nodeData.size = [100, 50];
  nodeData.style = {
    cursor: "move"
  };
  const newNode = graph.addItem("node", nodeData);
  addAnchors(newNode);
  // graph.paint();
});
