const PADDING = 10;

export default {
  setState(name, value, item) {
    if (name === "select") {
      let group = item.getContainer();
      let children = group.get("children");
      for (let i = 0, len = children.length; i < len; i++) {
        let child = children[i];
        if (child._attrs && child.attr("name") === "frame") {
          if (value) {
            child.show();
          } else {
            child.hide();
          }
        }
      } 
    } else if (name === "hover") {
      let group = item.getContainer();
      let children = group.get("children");
      for (let i = 0, len = children.length; i < len; i++) {
        let child = children[i];
        if (child._attrs && child.attr("name") === "anchor") {
          if (value) {
            child.show();
          } else {
            child.hide();
          }
        }
      }
    }
  },
  afterDraw(cfg, group) {
    const { id } = cfg;
    let [width, height] = cfg.size;
    width += PADDING;
    height += PADDING;

    const frame = group.addShape('path', {
      id: id + '_frame',
      attrs: {
        name: 'frame',
        x: -width / 2,
        y: -height / 2,
        width,
        height,
        path: [
          ['M', -width / 2, -height / 2],
          ['L', width / 2, -height / 2],
          ['L', width / 2, height / 2],
          ['L', -width / 2, height / 2],
          ['Z']
        ],
        stroke: "#00b",
        lineWidth: 2,
        lineDash: [5, 5],
      }
    });

    frame.hide();
  }
};