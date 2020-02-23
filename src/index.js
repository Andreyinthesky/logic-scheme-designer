import "./index.css";
import init from "./init.js";

import Input from "./model/Input";
import Output from "./model/Output";
import AndGate from "./model/gates/AndGate";
import OrGate from "./model/gates/OrGate";
import NotGate from "./model/gates/NotGate";
import XorGate from "./model/gates/XorGate";

let scale = 1.0;

const graphData = {
  nodes: [
    new AndGate("node1", { x: 250, y: 300 }),
    new NotGate("node2", { x: 100, y: 200 }),
    new Input("node3", { x: 300, y: 300 }),
    new Output("node4", { x: 550, y: 300 }),
  ]
};

const graph = init();

// function Scheme() {
//   this.customProp = 1;
//   this.customFunc = function () {
//     console.log("I'm custom method!");
//   };
// }

// graph.logicSchemeModel = new Scheme();

graphData.nodes.forEach(nodeData => {
  const newNode = graph.addItem("node", nodeData);
  addAnchors(newNode);
});

// console.log(graph);

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

let nextNodeId = 5;
document.getElementById("select-gate").addEventListener("click", event => {
  let nodeData = null;
  const nodePosition = graph.getPointByCanvas(100, 100);

  switch (event.target.id) {
    case "and":
      nodeData = new AndGate(null, nodePosition);
      break;
    case "or":
      nodeData = new OrGate(null, nodePosition);
      break;
    case "xor":
      nodeData = new XorGate(null, nodePosition);
      break;
    case "not":
      nodeData = new NotGate(null, nodePosition);
      break;
    default:
      return;
  }

  nodeData.id = "node" + nextNodeId++;

  const newNode = graph.addItem("node", nodeData);
  addAnchors(newNode);
});

function createLogicSchemeModel() {
  const visitedEdges = {};
  const elements = {};

  graph.getNodes().forEach(node => {
    const nodeModel = node.getModel();
    const nodeId = nodeModel.id;

    console.log(node.getEdges());

    for (let edge of node.getEdges()) {
      const edgeModel = edge.getModel();
      const edgeId = edgeModel.id;

      if (visitedEdges[edgeId]) {
        continue;
      }

      const startNodeAnchorIndex = (edgeModel.target === nodeId ? edgeModel.targetAnchor : edgeModel.sourceAnchor);
      const endNodeAnchorIndex = (edgeModel.target === nodeId ? edgeModel.sourceAnchor : edgeModel.targetAnchor);
      console.log(startNodeAnchorIndex, endNodeAnchorIndex);

      //check that anchor is output
      const isOutputAnchor = nodeModel.getOutputAnchors().includes(startNodeAnchorIndex);
      if (isOutputAnchor) {
        const outElement = (edgeModel.target === nodeId ? edge.getSource() : edge.getTarget());

        if (!elements[nodeId]) {
          elements[nodeId] = { node: nodeId, output: [] };
        }

        elements[nodeId].output.push({ inputIndex: endNodeAnchorIndex, element: outElement.get("id") });
        visitedEdges[edgeId] = edge;
      }
    }
  });
  console.log(visitedEdges);
  console.log(elements);
}

document.getElementById("test-mode-btn").addEventListener("click", () => {
  createLogicSchemeModel();
});
