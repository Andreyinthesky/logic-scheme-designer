import G6 from "@antv/g6";


const defineInput = () => {
  const rightOffset = 10;

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

      if (cfg.label) {
        const text = group.addShape("text", {
          attrs: {
            x: -rightOffset,
            y: 4,
            textAlign: "center",
            textBaseline: "middle",
            text: cfg.label,
            fontWeight: "bold",
            fontSize: 50,
            fontFamily: "Segoe UI, sans-serif",
            fill: cfg.color || "#000",
          },
        });
      }
      
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
  });
}

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

  G6.registerBehavior("click-add-edge", {
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
          console.log(edge.sourceAnchor, sourceAnchor);
          console.log(edge.targetAnchor, targetNodeAnchorIndex);
          console.log(edgeModel.source, targetNodeModel.id);
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

  return new G6.Graph({
    container: "mountNode",
    width: 1000,
    height: 400,
    maxZoom: 3,
    minZoom: 0.2,
    groupType: "rect",
    modes: {
      default: ["drag-node", "click-add-edge"]
    }
  });
}