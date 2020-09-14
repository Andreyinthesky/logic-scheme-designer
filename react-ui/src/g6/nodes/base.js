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
    } else if (name === "highlight") {
      let shape = item.getKeyShape();
      if (value) {
        shape.animate({
          repeat: true,
          onFrame(ratio) {
            const opacity = ratio < 0.5 ? 1 - 2 * ratio : (ratio - 0.5) * 2;
            return {
              opacity: opacity
            };
          },
        }, 625, "easeLinear");
      } else {
        shape.stopAnimate();
        shape.attr("opacity", 1);
      }
    }
  },
  afterDraw(cfg, group) {
    const { id, size } = cfg;
    const [width, height] = size;
    const frameWidth = width + PADDING;
    const frameHeight = height + PADDING;

    const frame = group.addShape('path', {
      id: id + '_frame',
      attrs: {
        name: 'frame',
        x: -frameWidth / 2,
        y: -frameHeight / 2,
        frameWidth,
        frameHeight,
        path: [
          ['M', -frameWidth / 2, -frameHeight / 2],
          ['L', frameWidth / 2, -frameHeight / 2],
          ['L', frameWidth / 2, frameHeight / 2],
          ['L', -frameWidth / 2, frameHeight / 2],
          ['Z']
        ],
        stroke: "#00b",
        lineWidth: 2,
        lineDash: [5, 5],
      }
    });
    frame.hide();

    for (let i = 0; i < cfg.anchorPoints.length; i++) {
      const [x, y] = cfg.anchorPoints[i];
      let anchor = group.addShape("marker", {
        id: id + "_anchor_bg_" + i,
        attrs: {
          boxName: "anchor",
          name: "anchor",
          x: x * width - width / 2,
          y: y * height - height / 2,
          r: 5,
          fill: "#f00"
        }
      });
      anchor.hide();
    }
  }
};