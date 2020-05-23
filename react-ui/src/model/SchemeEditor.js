import init from "./g6Init";
import { debounce } from "../utils";
import { FILE_VERSION, EDITOR_SIMULATION_MODE, EDITOR_EDITING_MODE } from "./constants";
import EditorObjIndexer from "./indexer";
import SchemeStatesStore from "./SchemeStatesStore";

import Input from "./Input";
import Output from "./Output";
import DelayGate from "./gates/DelayGate";
import AndGate from "./gates/AndGate";
import OrGate from "./gates/OrGate";
import NotGate from "./gates/NotGate";
import XorGate from "./gates/XorGate";
import { DIRECTION_RIGHT, DIRECTION_LEFT } from "./directions";

const restoreSchemeState = (editor, state) => {
  editor.restoration = true;
  editor._graph.read(state);
  editor.restoration = false;
}

const bindG6Events = (editor) => {
  const graph = editor._graph;

  graph.on("node:mouseout", evt => {
    let item = evt.item;

    graph.setItemState(item, "hover", false);
  });

  graph.on("wheel", evt => {
    editor.onWheel(evt);
  });

  const isElementSelected = (element, clickCoords) => {
    const node = element;
    const nodeModel = node.getModel();

    const { x, y } = clickCoords;
    const { x: centerX, y: centerY, size } = nodeModel;
    const selectBox = {
      minX: centerX - size[0] / 2,
      minY: centerY - size[1] / 2,
      maxX: centerX + size[0] / 2,
      maxY: centerY + size[1] / 2,
    };

    const isPointBelongsToSelectBox = x >= selectBox.minX && x <= selectBox.maxX
      && y >= selectBox.minY && y <= selectBox.maxY;

    return isPointBelongsToSelectBox;
  };

  const closeContextMenu = () => {
    editor.onCloseContextMenu();
    document.removeEventListener("click", closeContextMenu);
  };

  graph.on("node:contextmenu", evt => {
    evt.preventDefault();
    evt.stopPropagation();

    if (editor.getMode() !== EDITOR_EDITING_MODE) {
      return;
    }

    const { item } = evt;
    if (!isElementSelected(item, { x: evt.x, y: evt.y })) {
      return;
    }
    graph.emit("node:select", { item });
    editor.onOpenContextMenu({ x: evt.canvasX, y: evt.canvasY });
    document.addEventListener("click", closeContextMenu);
  });

  graph.on("canvas:mousemove", evt => {
    editor.onMouseMove(evt);
  });

  graph.on("afteradditem", evt => {
    if (editor.restoration)
      return;

    const { item } = evt;
    if (item.get("type") === "edge") {
      if (!item.getSource().get || !item.getTarget().get) {
        return;
      }
    }

    logEditorAction(editor);
  })


  let logDelete = true;
  graph.on("beforeremoveitem", evt => {
    logDelete = true;
    const { item } = evt;
    if (item.get("type") === "node") {
      const edges = item.getEdges();
      for (let i = edges.length; i >= 0; i--) {
        graph.removeItem(edges[i]);
      }
    } else if (item.get("type") === "edge") {
      if (!item.getSource().get || !item.getTarget().get) {
        logDelete = false;
      }
    }
  })

  graph.on("afterremoveitem", evt => {
    if (!logDelete) {
      return;
    }

    logEditorAction(editor);
  })

  const mountNode = graph.get("container");

  const canvasResize = debounce(() => {
    const width = mountNode.getBoundingClientRect().width;
    const height = mountNode.getBoundingClientRect().height;

    graph.changeSize(width, height);
  });

  window.onresize = () => {
    canvasResize();
  }
}

function logEditorAction(editor) {
  const scheme = editor.getScheme();
  scheme.nodes = scheme.nodes.map(node => {
    const position = { x: node.x, y: node.y };
    return createNodeModel(node.shape, node.index, position);
  });
  editor._store.log(scheme);
}

const createNodeModel = (type, index, position) => {
  const constructors = {
    "delay": DelayGate,
    "and": AndGate,
    "or": OrGate,
    "xor": XorGate,
    "not": NotGate,
    "input": Input,
    "output": Output,
  }

  if (!constructors[type])
    throw new Error(`Unknown node type - ${type}`);

  return new constructors[type](index, position);
}

function validateScheme(editor, scheme) {
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
    const highlightCycleNodes = () => cycleNodes.forEach(nodeId => editor._graph.setItemState(nodeId, "highlight", true));
    return {
      valid: false,
      error: {
        error: `В цепи обратной связи ${cycleNodes.map(nodeId => scheme[nodeId].label).join(" —> ")} 
                  отсутствует элемент задержки`,
        focus: () => {
          if (timeout)
            clearTimeout(timeout);
          editor._graph.focusItem(cycleNodes[0]);
          highlightCycleNodes();
          timeout = setTimeout(() => cycleNodes.forEach(nodeId => editor._graph.setItemState(nodeId, "highlight", false)), 5000);
        }
      }
    };
  }

  return { valid: true };
}

function createLogicSchemeModel(graph) {
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

const SIDEBAR_X_OFFSET = 320;

export default class SchemeEditor {
  constructor(mountHTMLElement) {
    this._graph = init(mountHTMLElement);
    bindG6Events(this);
    this._store = new SchemeStatesStore();
    logEditorAction(this);
  }

  addNode = (type) => {
    if (this.getMode() !== EDITOR_EDITING_MODE)
      return;

    const graph = this._graph;
    const position = graph.getPointByCanvas(100 + SIDEBAR_X_OFFSET, 100);
    graph.addItem("node", createNodeModel(type, graph.indexer.getNextIndex(type), position));
  }

  getScale = () => this._graph.getZoom();

  setScale = (scale) => {
    const graph = this._graph;

    if (scale < graph.get("minZoom") || scale > graph.get("maxZoom"))
      return;

    graph.zoomTo(scale);
    this.onUpdateScale({ scale });
  };

  getMode = () => { return this._graph.getCurrentMode() };

  setMode = (mode) => {
    if (mode === EDITOR_SIMULATION_MODE) {
      const scheme = createLogicSchemeModel(this._graph);
      const validationResult = validateScheme(this, scheme)
      if (!validationResult.valid) {
        this.onError(validationResult.error);
        return;
      }

      this._schemeElements = Object.values(scheme);
      this._rankedElements = rankElements(this._schemeElements);
    } else {
      this._rankedElements = null;
    }

    this._graph.setMode(mode);
    this.onChangeMode({ mode });
  };

  evaluateScheme = () => {
    if (this.getMode() !== EDITOR_SIMULATION_MODE || !this._rankedElements)
      return;

    evalScheme(this._rankedElements);

    this._schemeElements
      .filter(element => element instanceof Output || element instanceof DelayGate)
      .forEach(outElement => {
        const outElementValue = outElement.input[0];
        const outElementNode = this._graph.findById(outElement.id);

        this._graph.setItemState(outElementNode, "enable", outElementValue);
      });

    this.afterEvaluateScheme();
  };

  discardSchemeInputsState = () => {
    const elements = this._schemeElements;
    if (this.getMode() !== EDITOR_SIMULATION_MODE || !elements)
      return;

    elements
      .filter(element => element instanceof Input)
      .forEach(input => {
        input.input = input.input.map(v => false);
        this._graph.setItemState(this._graph.findById(input.id), "enable", false);
      });
  };

  rotateSelectedItems = () => {
    if (this.getMode() !== EDITOR_EDITING_MODE)
      return;

    this._graph.getNodes().forEach(node => {
      if (node.hasState("select")) {
        const nodeModel = node.getModel();
        if (!nodeModel.direction || !nodeModel.changeDirection) {
          return;
        }

        const currentDirection = nodeModel.direction;
        if (currentDirection === DIRECTION_RIGHT) {
          nodeModel.changeDirection(DIRECTION_LEFT);
        } else {
          nodeModel.changeDirection(DIRECTION_RIGHT);
        }

        // UPDATE NODE
        node.update();
        const xPos = nodeModel.x;
        const yPos = nodeModel.y;
        node.updatePosition({ x: xPos, y: yPos });
        node.getEdges().forEach(edge => edge.update());
        this._graph.paint();
      }
    });
  }

  deleteSelectedItems = () => {
    if (this.getMode() !== EDITOR_EDITING_MODE)
      return;

    this._graph.getEdges().forEach(edge => {
      edge.hasState("select") && this._graph.removeItem(edge);
    });

    this._graph.getNodes().forEach(node => {
      node.hasState("select") && this._graph.removeItem(node);
    });
  };

  goToOrigin = () => {
    const leftTopCorner = this._graph.getPointByCanvas(0, 0);
    const scale = this._graph.getZoom();
    this._graph.translate(leftTopCorner.x * scale, leftTopCorner.y * scale);
  };

  getScheme = () => {
    const schemeData = this._graph.save();
    schemeData.nodes = schemeData.nodes.map(({ id, index, x, y, shape, direction }) => {
      return { id, index, x, y, shape, direction };
    });

    return schemeData;
  }

  exportScheme = (name) => {
    const schemeData = this.getScheme();
    schemeData.version = FILE_VERSION;
    schemeData.name = name;
    schemeData.index = this._graph.indexer.index;

    return schemeData;
  };

  importScheme = (scheme) => {
    const editorState = { scheme };
    editorState.mode = EDITOR_EDITING_MODE;
    editorState.scale = 1;

    this.restoreState(editorState);
    this.afterImportScheme({ schemeName: scheme.name });
  };

  restart = () => {
    const container = this._graph.get("container");
    this._graph.destroy();
    this._graph = init(container);
    bindG6Events(this);

    this._store = new SchemeStatesStore();
    logEditorAction(this);
  }

  restoreState = (editorState) => {
    const { scale, mode, scheme } = editorState;

    scheme.nodes = scheme.nodes.map(node => {
      const position = { x: node.x, y: node.y };
      return createNodeModel(node.shape, node.index, position);
    })
    restoreSchemeState(this, scheme);
    this._graph.indexer = new EditorObjIndexer(scheme.index);

    this.setScale(scale);
    this.setMode(mode);

    this._store = new SchemeStatesStore();
    logEditorAction(this);
  }

  undo() {
    if (this.getMode() !== EDITOR_EDITING_MODE)
      return;

    if (this._store.doStack.length <= 1)
      return;

    this._store.undoStack.push(this._store.doStack.pop());
    const current = this._store.doStack[this._store.doStack.length - 1];
    restoreSchemeState(this, current);
  }

  redo() {
    if (this.getMode() !== EDITOR_EDITING_MODE)
      return;

    if (this._store.undoStack.length <= 0)
      return;

    this._store.doStack.push(this._store.undoStack.pop());
    const current = this._store.doStack[this._store.doStack.length - 1];
    restoreSchemeState(this, current);
  }

  // EVENTS

  afterImportScheme = (evt) => { };
  afterEvaluateScheme = (evt) => { };
  onError = (evt) => { };
  onWheel = (evt) => { };
  onUpdateScale = (evt) => { };
  onChangeMode = (evt) => { };
  onMouseMove = (evt) => { };
} 