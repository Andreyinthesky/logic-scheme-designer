const changeInputStateBehavior = {
  getEvents() {
    return {
      "node:mousedown": "onNodeMouseDown"
    };
  },

  onNodeMouseDown(ev) {
    const nativeEvent = ev.event;

    if (nativeEvent.which == 3) {
      const nodeModel = ev.item.getModel();

      if (nodeModel.shape === "input" || nodeModel.shape === "delay") {
        const isEnable = ev.item.hasState("enable");

        nodeModel.input = nodeModel.input.map(v => !isEnable);
        this.graph.setItemState(ev.item, "enable", !isEnable);
      }
    }
  }
};

export default changeInputStateBehavior;