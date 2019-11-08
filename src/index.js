import "./index.css"; 
import G6 from "@antv/g6";

import AND_GATE from "./svg_elems/AND_ANSI.svg"; 
import BUFFER_GATE from "./svg_elems/Buffer_ANSI.svg"; 
import NAND_GATE from "./svg_elems/NAND_ANSI.svg"; 
import NOR_GATE from "./svg_elems/NOR_ANSI.svg"; 
import NOT_GATE from "./svg_elems/NOT_ANSI.svg"; 
import OR_GATE from "./svg_elems/OR_ANSI.svg"; 
import XNOR_GATE from "./svg_elems/XNOR_ANSI.svg"; 
import XOR_GATE from "./svg_elems/XOR_ANSI.svg"; 

let scale = 1.0;

G6.registerBehavior("click-add-edge", {
  getEvents() {
    return {
      "node:click": "onClick",
      mousemove: "onMousemove",
      "edge:click": "onEdgeClick",
      "edge:mousedown": "onEdgeMousedown"
    };
  },
  onClick(ev) {
    const node = ev.item;
    const graph = this.graph;
    const point = {
      x: ev.x,
      y: ev.y
    };
    const anchorIndex = node.getLinkPoint(point).anchorIndex;
    const nodeModel = node.getModel();

    //FIXME: CHECK THE SAME NODE AND EDGE
    if (this.addingEdge && this.edge) {
      const edgeModel = this.edge.getModel();
      const hasSameEdge = node.getEdges().find(item => {
        const edge = item.getModel();
        const { sourceAnchor } = edgeModel;
        console.log(edge.sourceAnchor, sourceAnchor);
        console.log(edge.targetAnchor, anchorIndex);
        return (
          (edge.sourceAnchor === sourceAnchor && edge.targetAnchor === anchorIndex) ||
          (edge.targetAnchor === sourceAnchor && edge.sourceAnchor === anchorIndex)
        );
      }) !== undefined;
      const hasSameNodeAndAnchor =
        nodeModel.id === edgeModel.source && edgeModel.sourceAnchor === anchorIndex;

      console.log(hasSameEdge, hasSameNodeAndAnchor);
      if (hasSameEdge || hasSameNodeAndAnchor) return;

      graph.updateItem(this.edge, {
        target: nodeModel.id,
        targetAnchor: anchorIndex
      });
      this.edge = null;
      this.addingEdge = false;
    } else {
      this.edge = graph.addItem("edge", {
        source: nodeModel.id,
        sourceAnchor: anchorIndex,
        shape: "polyline",
        target: point,
        style: {
          lineWidth: 3
        }
      });
      this.addingEdge = true;
    }
  },
  onMousemove(ev) {
    const point = {
      x: ev.x,
      y: ev.y
    };
    if (this.addingEdge && this.edge) {
      this.graph.updateItem(this.edge, {
        target: point
      });
    }
  },
  onEdgeClick(ev) {
    const currentEdge = ev.item;
    if (this.addingEdge && this.edge == currentEdge) {
      graph.removeItem(this.edge);
      this.edge = null;
      this.addingEdge = false;
    }
  },
  onEdgeMousedown(ev) {
    const nativeEvent = ev.event;
    if (this.addingEdge) {
      return;
    }
    if (nativeEvent.which == 3) graph.removeItem(ev.item);
  }
});

const data = {
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
    }
  ]
};

const graph = new G6.Graph({
  container: "mountNode",
  // renderer: "svg",
  width: 1000,
  height: 400,
  maxZoom: 3,
  minZoom: 0.2,
  groupType: "rect",
  modes: {
    default: ["drag-node", "click-add-edge"]
  }
});

graph.read(data);

graph.getNodes().forEach((n, i) => {
  addAnchors(n);
});

function addAnchors(node) {
  const group = node.getContainer();
  const model = node.getModel();
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
  if ((deltaY > 0 && scale <= graph.get('minZoom')) || (deltaY < 0 && scale >= graph.get('maxZoom')))
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
graph.on("mousedown", ev => {
  console.log("drag start");
  if (ev.target.isKeyShape) return;
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

graph.on("mouseout", ev => {
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
