import init from "../g6Init";
import { debounce } from "../../utils";
import { FILE_VERSION, EDITOR_SIMULATION_MODE, EDITOR_EDITING_MODE } from "../constants";
import EditorObjIndexer from "./ItemIndexer";
import SchemeStatesStore from "./SchemeStatesStore";
import createNodeModel from "./createNodeModel"
import Input from "../g6Items/Input";
import DelayGate from "../g6Items/gates/DelayGate";
import { DIRECTION_RIGHT, DIRECTION_LEFT } from "../enum/directions";
import SchemeEditorEvaluator from "./SchemeEditorEvaluator";


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

  graph.on("editor:log", evt => {
    logEditorAction(editor);
  })

  window.onresize = () => {
    canvasResize(graph);
  }
}

const restoreSchemeState = (editor, state) => {
  editor.restoration = true;
  editor._graph.read(state);
  editor.restoration = false;
}

function simplifySchemeData(schemeData) {
  const simplidiedSchemeData = {}
  simplidiedSchemeData.nodes = schemeData.nodes.map(({ id, index, x, y, shape, direction }) => {
    return { id, index, x, y, shape, direction };
  });
  simplidiedSchemeData.edges = schemeData.edges
    .map(({ id, shape, source, target, sourceAnchor, targetAnchor }) => {
      return { id, shape, source, target, sourceAnchor, targetAnchor };
    });

  return simplidiedSchemeData;
}

function getScheme(editor) {
  const schemeData = editor._graph.save();
  schemeData.edges = schemeData.edges
    .filter(edge => typeof edge.source === "string" && typeof edge.target === "string");

  return simplifySchemeData(schemeData);
}

function logEditorAction(editor) {
  const scheme = getScheme(editor);
  scheme.nodes = scheme.nodes.map(node => {
    const position = { x: node.x, y: node.y };
    const model = createNodeModel(node.shape, node.index, position);
    model.changeDirection(node.direction);
    return model;
  });
  const state = { schemeData: scheme, editorLeftTopCorner: editor._graph.getCanvasByPoint(0, 0) }
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
    bindG6Events(this);
    this._store = new SchemeStatesStore();
    logEditorAction(this);
  }

  addNode = (type) => {
    if (this.getMode() !== EDITOR_EDITING_MODE)
      return;

    const graph = this._graph;
    const position = graph.getPointByCanvas(100, 100);
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

  evaluateScheme = () => {
    if (this.getMode() !== EDITOR_SIMULATION_MODE || !this._schemeEvaluator)
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

    logEditorAction(this);
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

    this._store = new SchemeStatesStore();
    logEditorAction(this);
  }

  restoreState = (editorState) => {
    const { scale, mode, fileData } = editorState;
    const { schemeData, index } = fileData;

    schemeData.nodes = schemeData.nodes.map(node => {
      const position = { x: node.x, y: node.y };
      const model = createNodeModel(node.shape, node.index, position);
      model.changeDirection(node.direction);
      return model;
    })

    restoreSchemeState(this, fileData.schemeData);
    this.setScale(scale);
    this.setMode(mode);

    fileData.editorLeftTopCorner
      && this._graph.translate(fileData.editorLeftTopCorner.x, fileData.editorLeftTopCorner.y);

    this._graph.indexer = new EditorObjIndexer(index);
    this._store = new SchemeStatesStore();
    logEditorAction(this);
  }

  undo() {
    if (this.getMode() !== EDITOR_EDITING_MODE)
      return;

    if (this._store.doStack.length <= 1)
      return;

    this._store.undoStack.push(this._store.doStack.pop());
    const current = this._store.getCurrent();
    restoreSchemeState(this, current.schemeData);
    current.editorLeftTopCorner
      && this._graph.translate(current.editorLeftTopCorner.x, current.editorLeftTopCorner.y);
  }

  redo() {
    if (this.getMode() !== EDITOR_EDITING_MODE)
      return;

    if (this._store.undoStack.length <= 0)
      return;

    this._store.doStack.push(this._store.undoStack.pop());
    const current = this._store.getCurrent();
    restoreSchemeState(this, current.schemeData);
    current.editorLeftTopCorner
      && this._graph.translate(current.editorLeftTopCorner.x, current.editorLeftTopCorner.y);
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