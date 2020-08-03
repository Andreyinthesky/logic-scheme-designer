import setCursorStyle from "../utils/setCursorStyle";


const START_DRAG_DELAY = 150;

const customDragNode = {
  getEvents() {
    return {
      "node:mousedown": "handleNodeMouseDown",
      "mouseup": "handleMouseUp",
      "mousemove": "handleMouseMove",
      "canvas:mouseleave": "handleMouseLeave",
    };
  },
  handleNodeMouseDown(evt) {
    this.dragTimeout = setTimeout(() => {
      this.startDragNode(evt.item, { x: evt.x, y: evt.y });
    }, START_DRAG_DELAY);
  },
  handleMouseUp(evt) {
    this.endDragNode();
  },
  handleMouseMove(evt) {
    if (!this.isStartDrag) {
      return;
    }

    if (!this.isFirstMove) {
      this.isFirstMove = true;
      setCursorStyle.call(this, "move");
    }

    this.dragNode({ x: evt.x, y: evt.y });
  },
  handleMouseLeave(evt) {
    this.endDragNode();
  },
  startDragNode(node, startCanvasCoords) {
    this.startCanvasCoords = startCanvasCoords;
    this.node = node;

    const nodeModel = node.getModel();
    this.startNodeCoords = { x: nodeModel.x, y: nodeModel.y };
    this.isStartDrag = true;
    this.isFirstMove = false;
  },
  endDragNode() {
    this.dragTimeout && clearTimeout(this.dragTimeout);
    this.isStartDrag = false;
  },
  dragNode(currentCanvasCoords) {
    const { graph, node, startCanvasCoords, startNodeCoords } = this;
    const { x, y } = currentCanvasCoords;
    const xOffset = x - startCanvasCoords.x;
    const yOffset = y - startCanvasCoords.y;
    const { x: nodeX, y: nodeY } = startNodeCoords;

    node.updatePosition({ x: nodeX + xOffset, y: nodeY + yOffset });
    graph.refreshItem(node);
    this.refreshEdgesByNode(node);
  },
  refreshEdgesByNode(node) {
    const { graph } = this;
    node.getEdges().forEach(edge => {
      graph.refreshItem(edge);
    });
  }
};

export default customDragNode;