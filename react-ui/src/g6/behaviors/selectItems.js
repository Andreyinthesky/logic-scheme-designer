const selectItemsBehavior = {
  getEvents() {
    return {
      "node:select": "onNodeSelect",
      "edge:select": "onEdgeSelect",
      "canvas:mousedown": "onCanvasMousedown",
      "beforemodechange": "onBeforeModeChange",
    };
  },
  onNodeSelect(evt) {
    this.selectItem(evt.item);
  },
  onEdgeSelect(evt) {
    this.selectItem(evt.item);
  },
  onCanvasMousedown(evt) {
    this.deselectAllItems();
  },
  onBeforeModeChange(evt) {
    this.deselectAllItems();
  },
  selectItem(item) {
    this.deselectAllItems();
    const isSelect = item.hasState("select");
    this.graph.setItemState(item, "select", !isSelect);
  },
  deselectAllItems() {
    this.graph.getEdges().forEach(edge => {
      this.graph.setItemState(edge, "select", false);
    });

    this.graph.getNodes().forEach(node => {
      this.graph.setItemState(node, "select", false);
    });
  },
}

export default selectItemsBehavior;