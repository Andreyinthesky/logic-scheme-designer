const SELECT_ANCHOR_RADIUS = 16;

const itemsControlBehaviour = {
  getEvents() {
    return {
      "node:click": "onClick",
      mousemove: "onMousemove",
      "node:mouseover": "onNodeMouseover",
      "node:mouseout": "onNodeMouseout",
      "node:select": "onNodeSelect",
      "edge:click": "onEdgeClick",
      "edge:mousedown": "onEdgeMousedown",
      "canvas:mousedown": "onCanvasMousedown",
      "beforemodechange": "onBeforeModeChange"
    };
  },
  onClick(evt) {
    const targetNode = evt.item;
    const graph = this.graph;
    const point = {
      x: evt.x,
      y: evt.y
    };
    const anchorPoint = targetNode.getLinkPoint(point);
    const distanceToAnchorPoint = Math.sqrt(Math.pow(point.x - anchorPoint.x, 2) + Math.pow(point.y - anchorPoint.y, 2));

    if (distanceToAnchorPoint > SELECT_ANCHOR_RADIUS) {
      if (!this.addingEdge) {
        this.graph.emit("node:select", {item: targetNode});
      }

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

      graph.emit("afteradditem", { item: this.drivenEdge });
      this.drivenEdge = null;
      this.addingEdge = false;
    } else {
      this.deselectAllItems();
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
  onNodeSelect(evt) {
    this.deselectAllItems();
    const isSelect = evt.item.hasState("select");
    this.graph.setItemState(evt.item, "select", !isSelect);
  },
  onMousemove(evt) {
    const point = {
      x: evt.x,
      y: evt.y
    };
    if (this.addingEdge && this.drivenEdge) {
      this.graph.updateItem(this.drivenEdge, {
        target: point
      });
    }
  },
  onNodeMouseover(evt) {
    let item = evt.item;
    if (item.hasState("hover")) {
      return;
    }

    this.graph.setItemState(item, "hover", true);
  },
  onNodeMouseout(evt) {
    let item = evt.item;

    this.graph.setItemState(item, "hover", false);
  },
  onEdgeClick(evt) {
    const clickedEdge = evt.item;
    if (this.addingEdge && this.drivenEdge == clickedEdge) {
      this.graph.removeItem(this.drivenEdge);
      this.drivenEdge = null;
      this.addingEdge = false;
      return;
    }

    if (!this.addingEdge) {
      this.deselectAllItems();
      this.graph.setItemState(clickedEdge, "select", true);
    }
  },
  onEdgeMousedown(evt) {
    const nativeEvent = evt.event;
    if (this.addingEdge) {
      return;
    }
    if (nativeEvent.which == 3) this.graph.removeItem(evt.item);
  },
  onCanvasMousedown(evt) {
    this.deselectAllItems();
  },
  onBeforeModeChange(evt) {
    this.deselectAllItems();
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
  },
  deselectAllItems() {
    this.graph.getEdges().forEach(edge => {
      this.graph.setItemState(edge, "select", false);
    });

    this.graph.getNodes().forEach(node => {
      this.graph.setItemState(node, "select", false);
    });
  },
};

export default itemsControlBehaviour;