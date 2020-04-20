const PADDING = 10;

export default {
  afterDraw(cfg, group) {
    const {id} = cfg;
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
        // styles
        // ...config.shapeControl.style.default.edge
        stroke: "#00b",
        lineWidth: 2,
        lineDash: [5, 5],
      }
    });

    frame.hide();
  }
};