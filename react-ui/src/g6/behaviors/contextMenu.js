const contextMenuBehavior = {
  getEvents() {
    return {
      "node:contextmenu": "onNodeContextMenu"
    }
  },
  onNodeContextMenu(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    const { item: node } = evt;
    const { graph } = this;
    if (!isNodeSelected(node, { x: evt.x, y: evt.y })) {
      return;
    }
    graph.emit("node:select", { item: node });
    graph.emit("editor:contextmenu", { x: evt.canvasX, y: evt.canvasY });
  }
}

const isNodeSelected = (element, clickCoords) => {
  const node = element;
  const nodeModel = node.getModel();

  const { x, y } = clickCoords;
  const { x: centerX, y: centerY, size } = nodeModel;
  const [width, height] = size;
  const selectBox = {
    minX: centerX - width / 2,
    minY: centerY - height / 2,
    maxX: centerX + width / 2,
    maxY: centerY + height / 2,
  };

  const isPointBelongsToSelectBox = x >= selectBox.minX && x <= selectBox.maxX
    && y >= selectBox.minY && y <= selectBox.maxY;

  return isPointBelongsToSelectBox;
};


export default contextMenuBehavior;