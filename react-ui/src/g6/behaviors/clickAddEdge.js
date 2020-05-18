const SELECT_ANCHOR_RADIUS = 16;
const NODE_SELECT_BOX_PADDING = 10;

const clickAddEdgeBehaviour = {
  getEvents() {
    return {
      "node:click": "onClick",
      "node:mousedown": "onNodeMousedown",
      mousemove: "onMousemove",
      "edge:click": "onEdgeClick",
      "edge:mousedown": "onEdgeMousedown",
      "canvas:mousedown": "onCanvasMousedown",
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
      if (!this.addingEdge) {
        this.deselectAllObjects();
        const isSelect = targetNode.hasState("select");
        this.graph.setItemState(targetNode, "select", !isSelect);
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
      this.deselectAllObjects();
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
  onNodeMousedown(ev) {
    if (this.addingEdge) {
      return;
    }

    const nativeEvent = ev.event;

    if (nativeEvent.which == 3) {
      const node = ev.item;
      const nodeModel = node.getModel();

      const { x, y } = ev;
      const { x: centerX, y: centerY, size } = nodeModel;
      const minX = centerX - size[0] / 2;
      const minY = centerY - size[1] / 2;
      const maxX = minX + size[0];
      const maxY = minY + size[1];

      const selectBox = {
        minX: minX + NODE_SELECT_BOX_PADDING,
        minY: minY + NODE_SELECT_BOX_PADDING,
        maxX: maxX - NODE_SELECT_BOX_PADDING,
        maxY: maxY - NODE_SELECT_BOX_PADDING,
      };

      const isPointBelongsToSelectBox = x >= selectBox.minX && x <= selectBox.maxX
        && y >= selectBox.minY && y <= selectBox.maxY;

      if (isPointBelongsToSelectBox) {
        this.graph.removeItem(ev.item);
      }
     
      // ROTATION
      // const isRotate = ev.item.hasState("rotate");
      // this.graph.setItemState(ev.item, "rotate", !isRotate);

      // const nodeModel = ev.item.getModel();
      // const xPos = nodeModel.x;
      // const yPos = nodeModel.y;

      // // UPDATE NODE
      // ev.item.updatePosition({x: xPos, y: yPos});
      // ev.item.getEdges().forEach(edge => edge.refresh());
      // this.graph.paint();
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
    const clickedEdge = ev.item;
    if (this.addingEdge && this.drivenEdge == clickedEdge) {
      this.graph.removeItem(this.drivenEdge);
      this.drivenEdge = null;
      this.addingEdge = false;
      return;
    }

    if (!this.addingEdge) {
      this.deselectAllObjects();
      this.graph.setItemState(clickedEdge, "select", true);
    }
  },
  onEdgeMousedown(ev) {
    const nativeEvent = ev.event;
    if (this.addingEdge) {
      return;
    }
    if (nativeEvent.which == 3) this.graph.removeItem(ev.item);
  },
  onCanvasMousedown() {
    this.deselectAllObjects();
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
  deselectAllObjects() {
    this.graph.getEdges().forEach(edge => {
      this.graph.setItemState(edge, "select", false);
    });

    this.graph.getNodes().forEach(node => {
      this.graph.setItemState(node, "select", false);
    });
  },
};

export default clickAddEdgeBehaviour;