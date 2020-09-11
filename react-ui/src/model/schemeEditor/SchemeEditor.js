import init from "../g6Init";
import { debounce } from "../../utils";
import { FILE_VERSION, EDITOR_SIMULATION_MODE, EDITOR_EDITING_MODE } from "../constants";
import SchemeEditorStatesStore from "./SchemeEditorStatesStore";
import ItemFactory from "./ItemFactory";
import { DIRECTION_RIGHT, DIRECTION_LEFT } from "../enum/directions";
import SchemeEditorEvaluator from "./SchemeEditorEvaluator";
import SchemeEditorState from "./SchemeEditorState";
import SchemeEditorFileData from "./SchemeEditorFileData";


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
    editor._logEditorState();
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
    .map(edge => edge.get("model"))
    .filter(edgeModel => edgeModel.isCompleted())
    .map(edgeModel => edgeModel.getData());

  schemeData.nodes = graph.getNodes()
    .map(node => node.getModel().getData());

  return schemeData;
}

function rotateNode(node) {
  const nodeModel = node.getModel();
  if (!nodeModel.direction || !nodeModel.changeDirection) {
    return;
  }

  const currentDirection = nodeModel.direction;
  if (currentDirection === DIRECTION_RIGHT) {
    nodeModel.direction = DIRECTION_LEFT;
  } else {
    nodeModel.direction = DIRECTION_RIGHT;
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
    bindG6Events(this);
    this._statesStore = new SchemeEditorStatesStore(this.getCurrentState());
  }

  addNode = (type) => {
    if (this.getMode() !== EDITOR_EDITING_MODE)
      return;

    const graph = this._graph;
    const position = graph.getPointByCanvas(100, 100);
    graph.addItem("node", ItemFactory.createNodeModel(type, graph.indexer.getNextIndex(type), position));
    this._logEditorState();
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
    if (this.getMode() !== EDITOR_SIMULATION_MODE || !this._schemeEvaluator)
      return;

    this._schemeEvaluator.discardInputsState();
  };

  discardSchemeDelaysState = () => {
    if (this.getMode() !== EDITOR_SIMULATION_MODE || !this._schemeEvaluator)
      return;

    this._schemeEvaluator.discardDelaysState();
  };

  rotateSelectedItems = () => {
    if (this.getMode() !== EDITOR_EDITING_MODE)
      return;

    this._graph.getNodes()
      .filter(node => node.hasState("select"))
      .forEach(node => rotateNode.call(this, node));

    this._logEditorState();
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

    this._logEditorState();
  };

  goToOrigin = () => {
    const leftTopCorner = this._graph.getPointByCanvas(0, 0);
    const scale = this._graph.getZoom();
    this._graph.translate(leftTopCorner.x * scale, leftTopCorner.y * scale);
    
    this._logEditorState();
  };

  canvasResize = () => {
    canvasResize(this._graph);
  }

  exportScheme = (fileName) => {
    const { schemeData, index, leftTopCornerPosition } = this.getCurrentState();

    const fileData = new SchemeEditorFileData({
      schemeData: schemeData,
      version: FILE_VERSION,
      name: fileName,
      index: index,
      editorLeftTopCorner: leftTopCornerPosition,
    });

    return fileData;
  };

  importScheme = (fileData) => {
    const { schemeData, index, editorLeftTopCorner } = fileData;
    const editorState = new SchemeEditorState({
      schemeData,
      leftTopCornerPosition: editorLeftTopCorner,
      index,
      mode: EDITOR_EDITING_MODE,
      scale: 1
    });

    this.restoreState(editorState);
    this.afterImportScheme({ schemeName: fileData.name });
  };

  restart = (newEditorState = null) => {
    const container = this._graph.get("container");
    this._graph.destroy();
    this._graph = init(container);
    bindG6Events(this);

    newEditorState && this.restoreState(newEditorState);

    this._statesStore = new SchemeEditorStatesStore(this.getCurrentState());
  }

  restoreState = (editorState) => {
    const { scale, mode, schemeData, index, leftTopCornerPosition } = editorState;

    restoreSchemeState(this, schemeData);
    this.setScale(scale);
    this.setMode(EDITOR_EDITING_MODE);
    leftTopCornerPosition && restoreCanvasLeftTopCornerPosition(this, leftTopCornerPosition);
    this._graph.indexer.index = index;
  }

  undo() {
    if (this.getMode() !== EDITOR_EDITING_MODE)
      return;

    if (!this._statesStore.pop()) {
      return;
    }

    this.restoreState(this._statesStore.getLast());
  }

  redo() {
    if (this.getMode() !== EDITOR_EDITING_MODE)
      return;

    const stateToRestore = this._statesStore.restore();
    stateToRestore && this.restoreState(stateToRestore);
  }

  _logEditorState = () => {
    const state = this.getCurrentState();
    this._statesStore.push(state);
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