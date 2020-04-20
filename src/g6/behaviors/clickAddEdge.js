const SELECT_ANCHOR_RADIUS = 16;

const clickAddEdgeBehaviour = {
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
    const anchorPoint = targetNode.getLinkPoint(point);
    const distanceToAnchorPoint = Math.sqrt(Math.pow(point.x - anchorPoint.x, 2) + Math.pow(point.y - anchorPoint.y, 2));

    if (distanceToAnchorPoint > SELECT_ANCHOR_RADIUS) {
      return;
    }

    const targetNodeModel = targetNode.getModel();
    const targetNodeAnchorIndex = anchorPoint.anchorIndex;

    if (this.addingEdge && this.drivenEdge) {
      const drivenEdgeModel = this.drivenEdge.getModel();
      const hasSameEdge = this.findExistingEdge(targetNode, targetNodeAnchorIndex, drivenEdgeModel) !== undefined;
      const isDrivenToSameNode = targetNodeModel.id === drivenEdgeModel.source;
      const isDrivenBetweenInputAndOutput = targetNodeModel.getInputAnchors().includes(targetNodeAnchorIndex)
        !== this.sourceNode.getModel().getInputAnchors().includes(drivenEdgeModel.sourceAnchor)

      if (hasSameEdge || isDrivenToSameNode || !isDrivenBetweenInputAndOutput) return;

      graph.updateItem(this.drivenEdge, {
        target: targetNodeModel.id,
        targetAnchor: targetNodeAnchorIndex
      });

      this.drivenEdge = null;
      this.addingEdge = false;
    } else {
      this.drivenEdge = graph.addItem("edge", {
        id: ("wire" + this.graph.indexer.getNextIndex("wire")),
        source: targetNodeModel.id,
        sourceAnchor: targetNodeAnchorIndex,
        shape: "wire",
        target: point,
        style: {
          lineWidth: 3
        }
      });
      this.addingEdge = true;
      this.sourceNode = targetNode;
    }
  },
  onMousemove(ev) {
    const point = {
      x: ev.x,
      y: ev.y
    };
    if (this.addingEdge && this.drivenEdge) {
      this.graph.updateItem(this.drivenEdge, {
        target: point
      });
    }
  },
  onEdgeClick(ev) {
    const currentEdge = ev.item;
    if (this.addingEdge && this.drivenEdge == currentEdge) {
      this.graph.removeItem(this.drivenEdge);
      this.drivenEdge = null;
      this.addingEdge = false;
    }
  },
  onEdgeMousedown(ev) {
    const nativeEvent = ev.event;
    if (this.addingEdge) {
      return;
    }
    if (nativeEvent.which == 3) this.graph.removeItem(ev.item);
  },
  findExistingEdge(targetNode, targetNodeAnchorIndex, drivenEdgeModel) {
    const targetNodeModel = targetNode.getModel();

    return targetNode.getEdges().find(item => {
      const edge = item.getModel();
      const {
        sourceAnchor
      } = drivenEdgeModel;

      return (
        (
          drivenEdgeModel.source === edge.source &&
          edge.sourceAnchor === sourceAnchor &&
          targetNodeModel.id === edge.target &&
          edge.targetAnchor === targetNodeAnchorIndex
        ) ||
        (
          drivenEdgeModel.source === edge.target &&
          edge.targetAnchor === sourceAnchor &&
          targetNodeModel.id === edge.source &&
          edge.sourceAnchor === targetNodeAnchorIndex
        )
      );
    })
  }
};

export default clickAddEdgeBehaviour;