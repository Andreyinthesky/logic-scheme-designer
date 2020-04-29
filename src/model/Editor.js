import init from "../init";
import { debounce } from "../utils";
import { FILE_VERSION, EDITOR_SIMULATION_MODE, EDITOR_EDITING_MODE } from "./constants";
import EditorObjIndexer from "../indexer";

import Input from "../model/Input";
import Output from "../model/Output";
import DelayGate from "../model/gates/DelayGate";
import AndGate from "../model/gates/AndGate";
import OrGate from "../model/gates/OrGate";
import NotGate from "../model/gates/NotGate";
import XorGate from "../model/gates/XorGate";

const bindG6Events = (editor) => {
  const graph = editor._graph;

  graph.on("node:mouseover", evt => {
    let item = evt.item;
    if (item.hasState("hover")) {
      return;
    }

    graph.setItemState(item, "hover", true);
  });

  graph.on("node:mouseout", evt => {
    let item = evt.item;

    graph.setItemState(item, "hover", false);
  });

  graph.on("afteradditem", evt => {
    const itemType = evt.item.get("type");

    if (itemType == "node") {
      addAnchors(evt.item);
    }
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

  graph.on("wheel", evt => {
    editor.onWheel(evt);
  });

  graph.on("canvas:mousemove", evt => {
    // console.log(evt.x, evt.y);
  })

  const mountNode = graph.get("container");

  const canvasResize = debounce(() => {
    console.log("resize");
    const width = mountNode.getBoundingClientRect().width;
    const height = mountNode.getBoundingClientRect().height;

    graph.changeSize(width, height);
  });

  window.onresize = () => {
    canvasResize();
  }
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

export default class SchemeEditor {
  constructor(mountHTMLElement) {
    this._graph = init(mountHTMLElement);
    bindG6Events(this);
  }

  addNode = (type) => {
    const graph = this._graph;
    const sideBarXOffset = 320;
    const position = graph.getPointByCanvas(100 + sideBarXOffset, 100);

    graph.addItem("node", createNodeModel(type, graph.indexer.getNextIndex(type), position));
  }

  getScale = () => {
    return this._graph.getZoom();
  };

  setScale = (scale) => {
    const graph = this._graph;

    if (scale < graph.get("minZoom") || scale > graph.get("maxZoom"))
      return;

    graph.zoomTo(scale);
    this.onUpdateScale({scale});
  };

  getMode = () => {
    this._graph.get("mode");
  };

  setMode = (mode) => {
    this._graph.setMode(mode);
    this.onChangeMode({mode});
  };

  deleteSelectedItems = () => {
    this._graph.getEdges().forEach(edge => {
      edge.hasState("select") && this._graph.removeItem(edge);
    });

    this._graph.getNodes().forEach(node => {
      node.hasState("select") && this._graph.removeItem(node);
    });
  };

  goToOrigin = () => {
    console.log("try to move to (0,0)");
    const leftTopCorner = this._graph.getPointByCanvas(0, 0);
    const scale = this._graph.getZoom();
    this._graph.translate(leftTopCorner.x * scale, leftTopCorner.y * scale);
  };

  exportScheme = (name) => {
    const schemeData = this._graph.save();
    schemeData.nodes = schemeData.nodes.map(({ id, index, x, y, shape, direction }) => {
      return { id, index, x, y, shape, direction };
    });
    schemeData.version = FILE_VERSION;
    schemeData.name = name;
    schemeData.index = this._graph.indexer.index;

    return schemeData;
  };

  importScheme = (scheme) => {
    scheme.nodes = scheme.nodes.map(node => {
      const position = { x: node.x, y: node.y };
      return createNodeModel(node.shape, node.index, position);
    })

    this._graph.read(scheme);
    this._graph.indexer = new EditorObjIndexer(scheme.index);
  };

  // EVENTS

  onWheel = (evt) => {};
  onUpdateScale = (evt) => { };
  onChangeMode = (evt) => { };
} 