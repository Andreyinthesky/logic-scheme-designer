import Input from "../g6Items/Input";
import Output from "../g6Items/Output";
import DelayGate from "../g6Items/gates/DelayGate";

const createLogicSchemeModel = (graph) => {
  const initElement = (element) => {
    const elementModel = element.getModel();
    elementModel.input = elementModel.input.map(v => false);
    elementModel.output = [];
    elementModel.rank = null;

    graph.setItemState(element, "enable", false);
  }

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

  return elements;
}

const findSchemeCycle = (elements) => {
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

const validateScheme = (graph, scheme) => {
  const schemeElements = Object.values(scheme);
  const cycle = findSchemeCycle(schemeElements);

  if (cycle.verdict) {
    const { path } = cycle;
    const cycleNodes = [];
    cycleNodes.push(cycle.start);
    for (let current = cycle.end; current !== cycle.start; current = path[current]) {
      cycleNodes.push(current);
    }

    let timeout = null;
    const highlightCycleNodes = (val) => cycleNodes.forEach(nodeId => graph.setItemState(nodeId, "highlight", val));
    return {
      valid: false,
      error: {
        error: `В цепи обратной связи ${cycleNodes.map(nodeId => scheme[nodeId].label).join(" —> ")} 
                  отсутствует элемент задержки`,
        focus: () => {
          if (timeout)
            clearTimeout(timeout);
          graph.focusItem(cycleNodes[0]);
          highlightCycleNodes(true);
          timeout = setTimeout(highlightCycleNodes, 5000);
        }
      }
    };
  }

  return { valid: true };
}

const rankElements = (elements) => {
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

const evaluateScheme = (rankedElements) => {
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
}

function updateItemsState() {
  this._schemeElements
    .filter(element => element instanceof Output || element instanceof DelayGate)
    .forEach(outElement => {
      const outElementValue = outElement.input[0];
      const outElementNode = this._graph.findById(outElement.id);

      this._graph.setItemState(outElementNode, "enable", outElementValue);
    });
}

export default class SchemeEditorEvaluator {
  constructor(editor) {
    const graph = editor._graph;
    const scheme = createLogicSchemeModel(graph);
    const schemeValidationResult = validateScheme(graph, scheme)
    if (!schemeValidationResult.valid) {
      throw schemeValidationResult.error;
    }

    this._graph = graph;
    this._schemeElements = Object.values(scheme);
    this._rankedElements = rankElements(this._schemeElements);
  }

  evaluate() {
    evaluateScheme(this._rankedElements);
    updateItemsState.call(this);
  }

  discardInputsState() {
    this._discardElementsState(Input);
  }

  discardDelaysState() {
    this._discardElementsState(DelayGate);
  }

  _discardElementsState(elementType) {
    this._schemeElements
      .filter(element => element instanceof elementType)
      .forEach(element => {
        element.input = element.input.map(v => false);
        this._graph.setItemState(this._graph.findById(element.id), "enable", false);
      });
  }
}