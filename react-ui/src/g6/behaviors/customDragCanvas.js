const customDragCanvasBehavior = {
  getEvents() {
    return {
      "canvas:mousedown": "onMouseDown",
      "mouseup": "onMouseUp",
      "mousemove": "onMouseMove",
      "canvas:mouseleave": "onMouseLeave",
    };
  },

  onMouseDown(evt) {
    this.dragCanvasCoord = { x: evt.x, y: evt.y };
    this.startDrag = true;
    this.isFirstMove = true;
  },
  onMouseUp(evt) {
    this.endDrag();
  },
  onMouseLeave(evt) {
    this.endDrag();
  },
  onMouseMove(evt) {
    const { graph } = this;
    const { startDrag, dragCanvasCoord } = this;
    if (!startDrag || !dragCanvasCoord) return;
    if (this.isFirstMove) {
      this.isFirstMove = false;
      this.setCursorStyle("move");
    }
    const scale = graph.getZoom();
    graph.translate((evt.x - dragCanvasCoord.x) * scale, (evt.y - dragCanvasCoord.y) * scale);
  },
  endDrag() {
    if (this.startDrag && !this.isFirstMove)
      this.graph.emit("editor:log");
    this.isFirstMove = true;
    this.startDrag = false;
    this.setCursorStyle("default");
  },
  setCursorStyle(style) {
    const container = this.graph.get("container");
    for (var i = 0; i < container.children.length; i++) {
      if (container.children[i].tagName === "CANVAS") {
        container.children[i].style.cursor = style;
        return;
      }
    }
  }
};

export default customDragCanvasBehavior;