const normalize = (sign) => {
  return Math.abs(sign) === 1 ? sign : 1;
};


const wire = {
  draw(cfg, group) {
    const {
      startPoint,
      endPoint
    } = cfg;
    const shape = group.addShape("path", {
      attrs: {
        stroke: "#F00",
        lineWidth: 3,
        lineAppendWidth: 9,
        path: (endPoint.x - startPoint.x < 0 ?
          [
            ["M", startPoint.x, startPoint.y],
            ["L", startPoint.x, startPoint.y + normalize(Math.sign(endPoint.y - startPoint.y)) * 45],
            ["L", endPoint.x, startPoint.y + normalize(Math.sign(endPoint.y - startPoint.y)) * 45],
            ["L", endPoint.x, endPoint.y]
          ] :
          [
            ["M", startPoint.x, startPoint.y],
            ["L", endPoint.x, startPoint.y],
            ["L", endPoint.x, endPoint.y]
          ]),
        shadowColor: "#00f",
      }
    });

    return shape;
  },
  setState(name, value, item) {
    const shape = item.getKeyShape();

    if (name === "select") {
      if (value) {
        shape.attr("shadowBlur", 4);
      } else {
        shape.attr("shadowBlur", 0);
      }
    }
  },
};

export default wire;