import "./index.css";
import init from "./init.js";
import EditorObjIndexer from "./indexer";

import Input from "./model/Input";
import Output from "./model/Output";
import DelayGate from "./model/gates/DelayGate";
import AndGate from "./model/gates/AndGate";
import OrGate from "./model/gates/OrGate";
import NotGate from "./model/gates/NotGate";
import XorGate from "./model/gates/XorGate";

let scale = 1.0;
const graph = init();

graph.indexer = new EditorObjIndexer();


const graphData = {
  nodes: [
    new AndGate(graph.indexer.getNextIndex("and"), { x: 250, y: 100 }),
    new NotGate(graph.indexer.getNextIndex("not"), { x: 150, y: 50 }),
    new Input(graph.indexer.getNextIndex("input"), { x: 150, y: 150 }),
    new OrGate(graph.indexer.getNextIndex("or"), { x: 250, y: 200 }),
    new XorGate(graph.indexer.getNextIndex("xor"), { x: 150, y: 250 }),
    new Output(graph.indexer.getNextIndex("output"), { x: 250, y: 300 }),
    new DelayGate(graph.indexer.getNextIndex("delay"), { x: 150, y: 350 }),
  ]
};

graphData.nodes.forEach(nodeData => {
  const newNode = graph.addItem("node", nodeData);
  addAnchors(newNode);
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

document.getElementById("fit-btn").addEventListener("click", event => {
  console.log("try to move to (0,0)");
  const leftTopCorner = graph.getPointByCanvas(0, 0);
  graph.translate(leftTopCorner.x * scale, leftTopCorner.y * scale);
});

document.getElementById("delay").addEventListener("click", evt => {
  addNode("delay");
});

document.getElementById("and").addEventListener("click", evt => {
  addNode("and");
});

document.getElementById("or").addEventListener("click", evt => {
  addNode("or");
});

document.getElementById("xor").addEventListener("click", evt => {
  addNode("xor");
});

document.getElementById("not").addEventListener("click", evt => {
  addNode("not");
});

document.getElementById("input").addEventListener("click", evt => {
  addNode("input");
});

document.getElementById("output").addEventListener("click", evt => {
  addNode("output");
});


function addNode(type) {
  let nodeData = null;
  const nodePosition = graph.getPointByCanvas(100, 100);

  switch (type) {
    case "delay":
      nodeData = new DelayGate(graph.indexer.getNextIndex("delay"), nodePosition);
      break;
    case "and":
      nodeData = new AndGate(graph.indexer.getNextIndex("and"), nodePosition);
      break;
    case "or":
      nodeData = new OrGate(graph.indexer.getNextIndex("or"), nodePosition);
      break;
    case "xor":
      nodeData = new XorGate(graph.indexer.getNextIndex("xor"), nodePosition);
      break;
    case "not":
      nodeData = new NotGate(graph.indexer.getNextIndex("not"), nodePosition);
      break;
    case "input":
      nodeData = new Input(graph.indexer.getNextIndex("input"), nodePosition);
      break;
    case "output":
      nodeData = new Output(graph.indexer.getNextIndex("output"), nodePosition);
      break;
    default:
      return;
  }

  const newNode = graph.addItem("node", nodeData);
  addAnchors(newNode);
};

const initElement = (element) => {
  if (!(element instanceof Input)) {
    element.input = element.input.map(v => false);
  }

  element.output = [];
  element.rank = null;
}

function createLogicSchemeModel() {
  const visitedEdges = {};
  const elements = {};

  graph.getNodes().forEach(node => {
    const nodeModel = node.getModel();
    const nodeId = nodeModel.id;
    initElement(nodeModel);

    for (let edge of node.getEdges()) {
      const edgeModel = edge.getModel();
      const edgeId = edgeModel.id;

      if (visitedEdges[edgeId]) {
        continue;
      }

      const startNodeAnchorIndex = (edgeModel.target === nodeId ? edgeModel.targetAnchor : edgeModel.sourceAnchor);
      const endNodeAnchorIndex = (edgeModel.target === nodeId ? edgeModel.sourceAnchor : edgeModel.targetAnchor);

      const isOutputAnchor = nodeModel.getOutputAnchors().includes(startNodeAnchorIndex);
      if (isOutputAnchor) {
        const outElement = (edgeModel.target === nodeId ? edge.getSource() : edge.getTarget());

        if (!elements[nodeId]) {
          elements[nodeId] = nodeModel;
        }

        const outElementId = outElement.get("id");
        if (!elements[outElementId]) {
          elements[outElementId] = outElement.getModel();
        }

        elements[nodeId].output.push({
          inputIndex: endNodeAnchorIndex,
          element: elements[outElementId],
        });
        visitedEdges[edgeId] = edge;
      }
    }
  });

  return Object.values(elements);
}

function rankElements(elements) {
  const queue = elements.filter(element => element instanceof Input);

  queue.forEach(element => element.rank = 0);

  while (queue.length > 0) {
    const current = queue.shift();
    const output = current.output;

    output && output.forEach(outputObj => {
      const output = outputObj.element;

      if (output.rank < current.rank + 1) {
        output.rank = current.rank + 1;
      }

      queue.push(output);
    });
  }

  const rankedElements = [];
  elements.forEach(element => {
    const rank = element.rank;

    if (!rankedElements[rank])
      rankedElements[rank] = [];

    rankedElements[rank].push(element);
  });

  return rankedElements;
}

function evalScheme(rankedElements) {
  console.log("start eval");
  const maxRank = rankedElements.length - 1;

  for (let rank = 0; rank <= maxRank; rank++) {
    rankedElements[rank].forEach(element => {
      const outputs = element.output;

      outputs && outputs.forEach(outputObj => {
        const output = outputObj.element;
        output.input[outputObj.inputIndex] = element.evaluate();
      });
    });
  }

  console.log("end eval");
}


let testModeActivated = false;
let logicSchemeModel;
let rankedElements;
document.getElementById("testMode-btn").addEventListener("click", () => {
  if (testModeActivated) {
    document.getElementById("doTact-btn").disabled = true;
    document.getElementById("discard-inputs-btn").disabled = true;
    document.getElementById("testMode-btn").classList.remove("active");
    testModeActivated = false;
    graph.setMode("default");
    return;
  }

  logicSchemeModel = createLogicSchemeModel();
  rankedElements = rankElements(logicSchemeModel);
  document.getElementById("doTact-btn").disabled = false;
  document.getElementById("discard-inputs-btn").disabled = false;
  document.getElementById("testMode-btn").classList.add("active");
  testModeActivated = true;
  graph.setMode("testScheme");
});

document.getElementById("doTact-btn").addEventListener("click", () => {
  console.log("do tact");

  evalScheme(rankedElements);

  logicSchemeModel
    .filter(element => element instanceof Output)
    .forEach(outElement => {
      const outElementValue = outElement.input[0];
      const outElementNode = graph.findById(outElement.id);

      graph.setItemState(outElementNode, "enable", outElementValue);
    })
});