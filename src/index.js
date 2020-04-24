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

const graph = init();

graph.moveTo(320, 70);

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

// console.log(graph.getPointByClient(0,0));

document.querySelector(".select-obj-toggler").addEventListener("click", evt => {
  if (document.getElementById("select-obj").classList.contains("hide")) {
    document.getElementById("select-obj").classList.remove("hide");
    return;
  }

  document.getElementById("select-obj").classList.add("hide");
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

let testModeActivated = false;

function addNode(type) {
  if (testModeActivated) {
    return;
  }
  
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

function findSchemeCycle(elements) {
  const stack = [];
  const color = {};
  const path = {};

  elements.forEach(element => {
    if (element instanceof Input || element instanceof DelayGate) {
      stack.push(element);
    }
    color[element.id] = 0;
  });

  while (stack.length > 0) {
    const current = stack[stack.length - 1];

    if (color[current.id] === 1) {
      color[current.id] = 2;
      stack.pop();
      continue;
    }
    color[current.id] = 1;

    const output = current.output;
    for (let outputObj of output) {
      const output = outputObj.element;

      if (color[output.id] === 2 || output instanceof DelayGate) {
        continue;
      }

      if (color[output.id] === 1) {
        console.log("cycle is exist!");
        console.log(`start is ${output.id}, end is ${current.id}`);
        return {
          verdict: true,
          start: output.id,
          end: current.id,
          path: path,
        };
      }

      path[output.id] = current.id;
      stack.push(output);
    }
  }

  return {verdict: false};
}

function rankElements(elements) {
  const delays = elements.filter(element => element instanceof DelayGate);
  const inputs = elements.filter(element => element instanceof Input);
  const stack = delays.concat(inputs);
  stack.forEach(element => element.rank = 0);

  while (stack.length > 0) {
    const current = stack.pop();
    const output = current.output;

    for (let outputObj of output) {
      const output = outputObj.element;

      if (output instanceof DelayGate) {
        continue;
      }

      if (output.rank < current.rank + 1) {
        output.rank = current.rank + 1;
      }

      stack.push(output);
    }
  }

  const rankedElements = [];
  rankedElements[0] = delays.concat(inputs);
  elements.forEach(element => {
    if (element.rank === 0)
      return;

    if (!rankedElements[element.rank])
      rankedElements[element.rank] = [];

    rankedElements[element.rank].push(element);
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
  const cycle = findSchemeCycle(logicSchemeModel);

  if (cycle.verdict) {
    const { path } = cycle;
    console.log(cycle.start);
    for (let current = cycle.end; current !== cycle.start; current = path[current]) {
      console.log(current);
    }
    return;
  }

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
    .filter(element => element instanceof Output || element instanceof DelayGate)
    .forEach(outElement => {
      const outElementValue = outElement.input[0];
      const outElementNode = graph.findById(outElement.id);

      graph.setItemState(outElementNode, "enable", outElementValue);
    })
});