import setCursorStyle from "../utils/setCursorStyle";


const customDragCanvasBehavior = {
  getEvents() {
    return {
      "canvas:mousedown": "handleMouseDown",
      "mouseup": "handleMouseUp",
      "mousemove": "handleMouseMove",
      "canvas:mouseleave": "handleMouseLeave",
    };
  },

  handleMouseDown(evt) {
    this.startDrag({ x: evt.clientX, y: evt.clientY });
  },
  handleMouseUp(evt) {
    this.endDrag();
  },
  handleMouseLeave(evt) {
    this.endDrag();
  },
  handleMouseMove(evt) {
    if (!this.isStartDrag) {
      return;
    }

    if (this.isFirstMove) {
      this.isFirstMove = false;
      setCursorStyle.call(this, "move");
    }

    this.translateCanvasByDrag({ x: evt.clientX, y: evt.clientY });
  },
  startDrag(startMouseCoord) {
    this.startMouseCoord = startMouseCoord;
    this.isStartDrag = true;
    this.isFirstMove = true;
  },
  endDrag() {
    if (this.isStartDrag && !this.isFirstMove)
      this.graph.emit("editor:log");
    this.isFirstMove = true;
    this.isStartDrag = false;
    setCursorStyle.call(this, "default");
  },
  translateCanvasByDrag(currentMouseCoords) {
    const { graph, startMouseCoord } = this;
    const { x, y } = currentMouseCoords;
    const xOffset = x - startMouseCoord.x;
    const yOffset = y - startMouseCoord.y;
    graph.translate(xOffset, yOffset);
    this.startMouseCoord = currentMouseCoords;
  },
};

export default customDragCanvasBehavior;