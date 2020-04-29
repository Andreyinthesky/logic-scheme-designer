import "./index.css";

import Input from "./model/Input";
import Output from "./model/Output";
import DelayGate from "./model/gates/DelayGate";

import { EDITOR_EDITING_MODE, EDITOR_SIMULATION_MODE } from "./model/constants";


export default function start(graph) {
  graph.moveTo(320, 70);

  let testModeActivated = false;

  const initElement = (element) => {
    const elementModel = element.getModel();
    elementModel.input = elementModel.input.map(v => false);
    elementModel.output = [];
    elementModel.rank = null;

    graph.setItemState(element, "enable", false);
  }

  function createLogicSchemeModel() {
    const visitedEdges = {};
    const elements = {};

    graph.getNodes().forEach(node => {
      const nodeModel = node.getModel();
      const nodeId = nodeModel.id;
      initElement(node);

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

    return { verdict: false };
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
      testModeActivated = false;
      graph.setMode(EDITOR_EDITING_MODE);
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
    testModeActivated = true;
    graph.setMode(EDITOR_SIMULATION_MODE);
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
}
