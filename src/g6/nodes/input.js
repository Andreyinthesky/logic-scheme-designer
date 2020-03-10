const rightOffset = 25;
const defaultSize = [60, 50];

const input = {
  draw(cfg, group) {
    cfg.size = defaultSize;
    const width = cfg.size[0];
    const height = cfg.size[1];

    const shape = group.addShape("path", {
      attrs: {
        ...cfg.style,
        path: [["M", width / 2, 0], ["l", -rightOffset, 0]],
        stroke: cfg.color || "#000",
        lineWidth: 3,
      }
    })

    group.addShape("circle", {
      attrs: {
        ...cfg.style,
        ...this.getCircleParams(cfg),
        stroke: cfg.color || "#000",
        lineWidth: cfg.lineWidth || 6,
        fill: cfg.fill || "#fff",
      },
    });

    group.addShape("text", {
      attrs: {
        x: -rightOffset,
        y: 4,
        textAlign: "center",
        textBaseline: "middle",
        text: "0",
        fontWeight: "bold",
        fontSize: 50,
        fontFamily: "Segoe UI, sans-serif",
        fill: cfg.color || "#000",
      },
    });

    //add background for better interaction
    const marginX = 10;
    group.addShape("rect", {
      attrs: {
        x: -width / 2,
        y: -height / 2,
        width: width + marginX,
        height: height,
        fill: "white",
        opacity: 0,
      }
    });

    //label text
    const labelTextOffsetX = -22;
    group.addShape("text", {
      attrs: {
        x: labelTextOffsetX,
        y: height,
        textAlign: "center",
        textBaseline: "middle",
        text: "ВХОД-1",
        fontWeight: "bold",
        fontSize: 14,
        fontFamily: "Times New Roman, serif",
        fill: cfg.color || "#000",
      },
    });

    return shape;
  },

  getCircleParams(cfg) {
    const width = cfg.size[0];

    const circleParams = {
      x: -rightOffset,
      y: 0,
      r: width / 2,
    };

    return circleParams;
  },

  setState(name, value, item) {
    const group = item.getContainer();
    const shape = group.get("children")[1];
    const label = group.get("children")[2];

    if (name === "enable") {
      if (value) {
        shape.attr("fill", "red");
        label.attr("text", "1");
      } else {
        shape.attr("fill", "white");
        label.attr("text", "0");
      }
    }
  },
};

export default input;