import G6 from "@antv/g6";

export default function init() {
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
          shape: "polyline",
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