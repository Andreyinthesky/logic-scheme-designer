import Wire from "../../model/g6Items/Wire";

const SELECT_ANCHOR_RADIUS = 16;

const addWireBehaviour = {
  getEvents() {
    return {
      "node:click": "onNodeClick",
      "mousemove": "onMousemove",
      "node:mouseover": "onNodeMouseover",
      "node:mouseout": "onNodeMouseout",
      "node:contextmenu": "onNodeContextMenu",
      "edge:click": "onEdgeClick",
      "edge:mousedown": "onEdgeMousedown",
      "keydown": "onKeyDown",
    };
  },
  onNodeClick(evt) {
    const node = evt.item;
    const point = {
      x: evt.x,
      y: evt.y
    };
    const anchorPoint = node.getLinkPoint(point);
    const distanceToAnchorPoint = Math.sqrt(Math.pow(point.x - anchorPoint.x, 2) + Math.pow(point.y - anchorPoint.y, 2));

    if (distanceToAnchorPoint > SELECT_ANCHOR_RADIUS) {
      if (!this.addingEdge) {
        this.graph.emit("node:select", { item: node });
      }
      return;
    }

    const nodeModel = node.getModel();
    const nodeAnchorIndex = anchorPoint.anchorIndex;

    if (this.addingEdge && this.drivenEdge) {
      const drivenEdgeModel = this.drivenEdge.getModel();
      const hasSameEdge = this.findExistingEdge(node, nodeAnchorIndex, drivenEdgeModel) !== undefined;
      const isDrivenToSameNode = nodeModel.id === drivenEdgeModel.source;
      const isDrivenBetweenInputAndOutput = nodeModel.getInputAnchors().includes(nodeAnchorIndex)
        !== this.sourceNode.getModel().getInputAnchors().includes(drivenEdgeModel.sourceAnchor)

      if (hasSameEdge || isDrivenToSameNode || !isDrivenBetweenInputAndOutput)
        return;

      this.completeDrivenEdge(node, nodeAnchorIndex);
    } else {
      this.addDrivenEdge(node, nodeAnchorIndex, point);
    }
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
  onNodeContextMenu(evt) {
    this.removeDrivenEdge();
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
      this.graph.emit("edge:select", {item: clickedEdge});
    }
  },
  onEdgeMousedown(evt) {
    const nativeEvent = evt.event;
    if (nativeEvent.which == 3) {
      if (this.addingEdge) {
        this.removeDrivenEdge();
      } else {
        this.graph.removeItem(evt.item);
      }
    }
  },
  onKeyDown(evt) {
    if (evt.keyCode === 27) {
      this.removeDrivenEdge();
    }
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
  addDrivenEdge(sourceNode, sourceNodeAnchorIndex, endPoint) {
    const sourceNodeModel = sourceNode.getModel();
    this.drivenEdge = this.graph.addItem("edge", new Wire({
      index: this.graph.indexer.getNextIndex("wire"),
      source: sourceNodeModel.id,
      sourceAnchor: sourceNodeAnchorIndex,
      target: endPoint,
    }));
    this.addingEdge = true;
    this.sourceNode = sourceNode;
  },
  removeDrivenEdge() {
    if (this.addingEdge && this.drivenEdge) {
      this.graph.removeItem(this.drivenEdge);
      this.drivenEdge = null;
      this.addingEdge = false;
    }
  },
  completeDrivenEdge(targetNode, targetNodeAnchorIndex) {
    if (this.addingEdge && this.drivenEdge) {
      const targetNodeModel = targetNode.getModel();

      const edgeModel = this.drivenEdge.get("model");
      edgeModel.target = targetNodeModel.id;
      edgeModel.targetAnchor = targetNodeAnchorIndex;
      this.graph.updateItem(this.drivenEdge, edgeModel);

      this.graph.emit("editor:log");
      this.drivenEdge = null;
      this.addingEdge = false;
    }
  },
};

export default addWireBehaviour;