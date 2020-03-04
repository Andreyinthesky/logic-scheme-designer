import G6 from "@antv/g6";
import DELAY_GATE from "./assets/svg_elements/Buffer_ANSI.svg";

const registerChangeInputStateBehavior = () => {
  G6.registerBehavior("change-input-state", {
    getEvents() {
      return {
        "node:mousedown": "onNodeMouseDown"
      };
    },

    onNodeMouseDown(ev) {
      const nativeEvent = ev.event;

      if (nativeEvent.which == 3) {
        const nodeModel = ev.item.getModel();

        if (nodeModel.shape == "input") {
          const isEnable = ev.item.hasState("enable");

          nodeModel.input = nodeModel.input.map(v => !isEnable);
          this.graph.setItemState(ev.item, "enable", !isEnable);
        }
      }
    }
  })
};

const registerClickAddEdgeBehavior = () => {
  G6.registerBehavior("click-add-edge", {
    nextEdgeIndex: 1,
    getEvents() {
      return {
        "node:click": "onClick",
        mousemove: "onMousemove",
        "edge:click": "onEdgeClick",
        "edge:mousedown": "onEdgeMousedown"
      };
    },
    onClick(ev) {
      const targetNode = ev.item;
      const graph = this.graph;
      const point = {
        x: ev.x,
        y: ev.y
      };
      const targetNodeModel = targetNode.getModel();
      const targetNodeAnchorIndex = targetNode.getLinkPoint(point).anchorIndex;

      if (this.addingEdge && this.edge) {
        const edgeModel = this.edge.getModel();
        const hasSameEdge = targetNode.getEdges().find(item => {
          const edge = item.getModel();
          const {
            sourceAnchor
          } = edgeModel;

          return (
            (
              edgeModel.source === edge.source &&
              edge.sourceAnchor === sourceAnchor &&
              targetNodeModel.id === edge.target &&
              edge.targetAnchor === targetNodeAnchorIndex
            ) ||
            (
              edgeModel.source === edge.target &&
              edge.targetAnchor === sourceAnchor &&
              targetNodeModel.id === edge.source &&
              edge.sourceAnchor === targetNodeAnchorIndex
            )
          );
        }) !== undefined;
        const hasSameNodeAndAnchor =
          targetNodeModel.id === edgeModel.source && edgeModel.sourceAnchor === targetNodeAnchorIndex;

        console.log(hasSameEdge, hasSameNodeAndAnchor);
        if (hasSameEdge || hasSameNodeAndAnchor) return;

        graph.updateItem(this.edge, {
          target: targetNodeModel.id,
          targetAnchor: targetNodeAnchorIndex
        });

        this.edge = null;
        this.addingEdge = false;
      } else {
        this.edge = graph.addItem("edge", {
          id: ("edge" + this.nextEdgeIndex++),
          source: targetNodeModel.id,
          sourceAnchor: targetNodeAnchorIndex,
          shape: "wire",
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
        this.graph.removeItem(this.edge);
        this.edge = null;
        this.addingEdge = false;
      }
    },
    onEdgeMousedown(ev) {
      const nativeEvent = ev.event;
      if (this.addingEdge) {
        return;
      }
      if (nativeEvent.which == 3) this.graph.removeItem(ev.item);
    }
  });
};

const defineOutput = () => {
  const leftOffset = 25;

  G6.registerNode("output", {
    draw(cfg, group) {
      const size = cfg.size || this.getDefaultSize();
      const width = size[0];

      const shape = group.addShape("path", {
        attrs: {
          ...cfg.style,
          path: [["M", -width / 2, 0], ["l", leftOffset, 0]],
          stroke: cfg.color || "#000",
          lineWidth: 3,
        }
      })

      group.addShape("path", {
        attrs: {
          ...cfg.style,
          path: this.getPath(cfg),
          stroke: cfg.color || "#000",
          lineWidth: cfg.lineWidth || 6,
          fill: cfg.fill || "#fff",
        },
      });

      const text = group.addShape("text", {
        attrs: {
          x: leftOffset / 2,
          y: 4,
          textAlign: "center",
          textBaseline: "middle",
          text: "0",
          fontWeight: "bold",
          fontSize: 50,
          fontFamily: "Segoe UI, sans-serif",
          fill: cfg.color || "#000",
        },
      });

      //add background for better interaction
      const marginX = -10;
      group.addShape("rect", {
        attrs: {
          x: -size[0] / 2 + marginX,
          y: -size[1] / 2,
          width: size[0],
          height: size[1],
          fill: "white",
          // fill: "red",
          opacity: 0,
        }
      });

      //label text
      const labelTextOffsetX = 12;
      const labelTextOffsetY = -10;
      group.addShape("text", {
        attrs: {
          x: labelTextOffsetX,
          y: size[1] + labelTextOffsetY,
          textAlign: "center",
          textBaseline: "middle",
          text: "ВЫХОД-1",
          fontWeight: "bold",
          fontSize: 14,
          fontFamily: "Times New Roman, serif",
          fill: cfg.color || "#000",
        },
      });

      return shape;
    },

    getPath(cfg) {
      const size = cfg.size || this.getDefaultSize();
      const width = size[0];
      const height = size[1];

      const path = [
        ["M", -width / 2 + leftOffset, height / 2],
        ["L", width / 2, height / 2],
        ["L", width / 2, -height / 2],
        ["L", -width / 2 + leftOffset, -height / 2],
        ["Z"]
      ];

      return path;
    },

    getDefaultSize() {
      return [75, 60];
    },

    setState(name, value, item) {
      const group = item.getContainer();
      const label = group.get("children")[2];

      if (name === "enable") {
        if (value) {
          label.attr("text", "1");
        } else {
          label.attr("text", "0");
        }
      }
    },
  });
};

const defineInput = () => {
  const rightOffset = 25;

  G6.registerNode("input", {
    draw(cfg, group) {
      cfg.size = [60, 50];

      const shape = group.addShape("path", {
        attrs: {
          ...cfg.style,
          path: [["M", (cfg.size[0]) / 2, 0], ["l", -rightOffset, 0]],
          stroke: cfg.color || "#000",
          lineWidth: 3,
        }
      })

      group.addShape("circle", {
        attrs: {
          ...cfg.style,
          ...this.getCircleParams(cfg),
          stroke: cfg.color || "#000",
          lineWidth: cfg.lineWidth || 6,
          fill: cfg.fill || "#fff",
        },
      });

      group.addShape("text", {
        attrs: {
          x: -rightOffset,
          y: 4,
          textAlign: "center",
          textBaseline: "middle",
          text: "0",
          fontWeight: "bold",
          fontSize: 50,
          fontFamily: "Segoe UI, sans-serif",
          fill: cfg.color || "#000",
        },
      });

      //add background for better interaction
      const marginX = 10;
      group.addShape("rect", {
        attrs: {
          x: -cfg.size[0] / 2,
          y: -cfg.size[1] / 2,
          width: cfg.size[0] + marginX,
          height: cfg.size[1],
          // fill: "red",
          fill: "white",
          opacity: 0,
        }
      });

      //label text
      const labelTextOffsetX = -22;
      group.addShape("text", {
        attrs: {
          x: labelTextOffsetX,
          y: cfg.size[1],
          textAlign: "center",
          textBaseline: "middle",
          text: "ВХОД-1",
          fontWeight: "bold",
          fontSize: 14,
          fontFamily: "Times New Roman, serif",
          fill: cfg.color || "#000",
        },
      });

      return shape;
    },

    getCircleParams(cfg) {
      const width = cfg.size[0];

      const circleParams = {
        x: -rightOffset,
        y: 0,
        r: width / 2,
      };

      return circleParams;
    },

    setState(name, value, item) {
      const group = item.getContainer();
      const shape = group.get("children")[1];
      const label = group.get("children")[2];

      if (name === "enable") {
        if (value) {
          shape.attr("fill", "red");
          label.attr("text", "1");
        } else {
          shape.attr("fill", "white");
          label.attr("text", "0");
        }
      }
    },
  });
};

const defineDelayElement = () => {
  G6.registerNode("delay", {
    draw(cfg, group) {
      cfg.size = [100, 50];

      const shape = group.addShape("image", {
        attrs: {
          x: 0,
          y: 0,
          img: DELAY_GATE,
          width: cfg.size[0],
          height: cfg.size[1],
        }
      });

      // z mark
      const zMarkOffsetX = 15;
      const zMarkOffsetY = -15;
      group.addShape("text", {
        attrs: {
          x: cfg.size[0] / 2 + zMarkOffsetX,
          y: cfg.size[1] / 2 + zMarkOffsetY,
          textAlign: "center",
          textBaseline: "middle",
          text: "Z",
          fontWeight: "bold",
          fontSize: 14,
          fontFamily: "Segoe UI, sans-serif",
          fill: cfg.color || "#000",
        },
      });

      //state
      const stateTextOffsetX = -6;
      const stateTextOffsetY = 1;
      group.addShape("text", {
        attrs: {
          x: cfg.size[0] / 2 + stateTextOffsetX,
          y: cfg.size[1] / 2 + stateTextOffsetY,
          textAlign: "center",
          textBaseline: "middle",
          text: "0",
          fontWeight: "bold",
          fontSize: 20,
          fontFamily: "Segoe UI, sans-serif",
          fill: cfg.color || "#000",
        },
      });

      return shape;
    },
  });
};

const defineWire = () => {
  const normalize = (sign) => {
    return Math.abs(sign) === 1 ? sign : 1;
  };

  G6.registerEdge("wire", {
    draw(cfg, group) {
      const {
        startPoint,
        endPoint
      } = cfg;
      const shape = group.addShape("path", {
        attrs: {
          stroke: "#F00",
          lineWidth: 3,
          lineAppendWidth: 9,
          path: (endPoint.x - startPoint.x < 0 ?
            [
              ["M", startPoint.x, startPoint.y],
              ["L", startPoint.x, startPoint.y + normalize(Math.sign(endPoint.y - startPoint.y)) * 25],
              ["L", endPoint.x, startPoint.y + normalize(Math.sign(endPoint.y - startPoint.y)) * 25],
              ["L", endPoint.x, endPoint.y]
            ] :
            [
              ["M", startPoint.x, startPoint.y],
              ["L", endPoint.x, startPoint.y],
              ["L", endPoint.x, endPoint.y]
            ]),
        }
      });

      return shape;
    }
  })
};

export default function init() {
  defineWire();
  defineInput();
  defineOutput();
  defineDelayElement();

  registerClickAddEdgeBehavior();
  registerChangeInputStateBehavior();

  const mountNode = document.getElementById("mountNode");

  return new G6.Graph({
    container: "mountNode",
    width: mountNode.offsetWidth,
    height: 400,
    maxZoom: 3,
    minZoom: 0.2,
    groupType: "rect",
    modes: {
      default: ["drag-node", "click-add-edge", ],
      testScheme: ["change-input-state", ],
    }
  });
}