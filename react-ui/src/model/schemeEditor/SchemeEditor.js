import init from "../g6Init";
import { debounce } from "../../utils";
import { FILE_VERSION, EDITOR_SIMULATION_MODE, EDITOR_EDITING_MODE } from "../constants";
import SchemeEditorStatesStore from "./SchemeEditorStatesStore";
import ItemFactory from "./ItemFactory";
import Input from "../g6Items/Input";
import DelayGate from "../g6Items/gates/DelayGate";
import { DIRECTION_RIGHT, DIRECTION_LEFT } from "../enum/directions";
import SchemeEditorEvaluator from "./SchemeEditorEvaluator";
import SchemeEditorState from "./SchemeEditorState";



const canvasResize = debounce((graph) => {
  const mountNode = graph.get("container");
  const width = mountNode.getBoundingClientRect().width;
  const height = mountNode.getBoundingClientRect().height;

  graph.changeSize(width, height);
});

const bindG6Events = (editor) => {
  const graph = editor._graph;

  graph.on("wheel", evt => {
    editor.onWheel(evt);
  });

  const closeContextMenu = () => {
    editor.onCloseContextMenu();
    document.removeEventListener("click", closeContextMenu);
  };

  graph.on("editor:contextmenu", evt => {
    editor.onOpenContextMenu({ x: evt.x, y: evt.y });
    document.addEventListener("click", closeContextMenu);
  });

  graph.on("canvas:mousemove", evt => {
    editor.onMouseMove(evt);
  });

  graph.on("editor:log", evt => {
    logEditorState(editor);
  })

  window.onresize = () => {
    canvasResize(graph);
  }
}

const restoreSchemeState = (editor, schemeData) => {
  const scheme = {
    nodes: schemeData.nodes
      .map(nodeData => ItemFactory.createNodeModelFromData(nodeData)),

    edges: schemeData.edges
      .map(edgeData => ItemFactory.createEdgeModelFromData(edgeData))
  }

  editor._graph.read(scheme);
}

function restoreCanvasLeftTopCornerPosition(editor, position) {
  const currentLeftTopCornerPosition = editor._graph.getCanvasByPoint(0, 0);
  const dx = position.x - currentLeftTopCornerPosition.x;
  const dy = position.y - currentLeftTopCornerPosition.y;
  editor._graph.translate(dx, dy);
}

function getScheme(editor) {
  const graph = editor._graph;
  const schemeData = {};

  schemeData.edges = graph.getEdges()
    .map(edge => edge.getModel())
    .filter(edgeModel => edgeModel.isCompleted())
    .map(edgeModel => edgeModel.getData());

  schemeData.nodes = graph.getNodes()
    .map(node => node.getModel().getData());

  return schemeData;
}

function logEditorState(editor) {
  const state = editor.getCurrentState();
  editor._store.log(state);
}

function rotateNode(node) {
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
  node.updatePosition({ x: nodeModel.x, y: nodeModel.y });
  node.getEdges().forEach(edge => edge.update());
  this._graph.paint();
}

export default class SchemeEditor {
  constructor(mountHTMLElement) {
    this._graph = init(mountHTMLElement);
    this._store = new SchemeEditorStatesStore();
    bindG6Events(this);
    logEditorState(this);
  }

  addNode = (type) => {
    if (this.getMode() !== EDITOR_EDITING_MODE)
      return;

    const graph = this._graph;
    const position = graph.getPointByCanvas(100, 100);
    graph.addItem("node", ItemFactory.createNodeModel(type, graph.indexer.getNextIndex(type), position));
    logEditorState(this);
  }

  getScale = () => this._graph.getZoom();

  setScale = (scale) => {
    const graph = this._graph;

    if (scale < graph.get("minZoom") || scale > graph.get("maxZoom"))
      return;

    graph.zoomTo(scale);
    this.onUpdateScale({ scale });
  };

  getMode = () => this._graph.getCurrentMode();

  setMode = (mode) => {
    if (mode === EDITOR_SIMULATION_MODE) {
      try {
        this._schemeEvaluator = new SchemeEditorEvaluator(this);
      } catch (e) {
        console.log(e);
        this.onError(e);
        return;
      }
    } else {
      this._schemeEvaluator = null;
    }

    this._graph.setMode(mode);
    this.onChangeMode({ mode });
  };

  getCurrentState = () => {
    return new SchemeEditorState(
      {
        leftTopCornerPosition: this._graph.getCanvasByPoint(0, 0),
        schemeData: getScheme(this),
        scale: this.getScale(),
        mode: this.getMode(),
        index: { ...this._graph.indexer.index },
      });
  }

  evaluateScheme = () => {
    if (this.getMode() !== EDITOR_SIMULATION_MODE)
      return;

    this._schemeEvaluator.evaluate();
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

  discardSchemeDelaysState = () => {
    const elements = this._schemeElements;
    if (this.getMode() !== EDITOR_SIMULATION_MODE || !elements)
      return;

    elements
      .filter(element => element instanceof DelayGate)
      .forEach(delay => {
        delay.input = delay.input.map(v => false);
        this._graph.setItemState(this._graph.findById(delay.id), "enable", false);
      });
  };

  rotateSelectedItems = () => {
    if (this.getMode() !== EDITOR_EDITING_MODE)
      return;

    this._graph.getNodes()
      .filter(node => node.hasState("select"))
      .forEach(node => rotateNode.call(this, node));

    logEditorState(this);
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

    logEditorState(this);
  };

  goToOrigin = () => {
    const leftTopCorner = this._graph.getPointByCanvas(0, 0);
    const scale = this._graph.getZoom();
    this._graph.translate(leftTopCorner.x * scale, leftTopCorner.y * scale);
  };

  canvasResize = () => {
    canvasResize(this._graph);
  }

  exportScheme = (name) => {
    const fileData = {};
    fileData.schemeData = getScheme(this);
    fileData.version = FILE_VERSION;
    fileData.name = name;
    fileData.index = this._graph.indexer.index;
    fileData.editorLeftTopCorner = this._graph.getCanvasByPoint(0, 0);

    return fileData;
  };

  importScheme = (fileData) => {
    const editorState = { fileData };
    editorState.mode = EDITOR_EDITING_MODE;
    editorState.scale = 1;

    this.restoreState(editorState);
    this.afterImportScheme({ schemeName: fileData.name });
  };

  restart = () => {
    const container = this._graph.get("container");
    this._graph.destroy();
    this._graph = init(container);
    bindG6Events(this);

    this._store = new SchemeEditorStatesStore();
    logEditorState(this);
  }

  restoreState = (editorState) => {
    const { scale, mode, schemeData, index, leftTopCornerPosition } = editorState;

    restoreSchemeState(this, schemeData);
    this.setScale(scale);
    this.setMode(mode);
    leftTopCornerPosition && restoreCanvasLeftTopCornerPosition(this, leftTopCornerPosition);
    this._graph.indexer.index = index;
  }

  undo() {
    if (this.getMode() !== EDITOR_EDITING_MODE)
      return;

    if (this._store.doStack.length <= 1)
      return;

    this._store.undoStack.push(this._store.doStack.pop());
    this.restoreState(this._store.getCurrent());
  }

  redo() {
    if (this.getMode() !== EDITOR_EDITING_MODE)
      return;

    if (this._store.undoStack.length <= 0)
      return;

    this._store.doStack.push(this._store.undoStack.pop());
    this.restoreState(this._store.getCurrent());
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