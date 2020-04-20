const connectorOffset = 25;

const input = {
  draw(cfg, group) {
    const width = cfg.size[0];
    const height = cfg.size[1];

    const shape = group.addShape("path", {
      attrs: {
        ...cfg.style,
        path: [["M", width / 2, 0], ["l", -connectorOffset, 0]],
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
        // fill: cfg.fill || "#fff",
      },
    });

    group.addShape("text", {
      attrs: {
        x: -width / 2 + height / 2,
        y: 3,
        textAlign: "center",
        textBaseline: "middle",
        text: "0",
        fontWeight: "bold",
        fontSize: 40,
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
    group.addShape("text", {
      attrs: {
        x: -width / 2 + height / 2,
        y: height / 2 + 7,
        textAlign: "center",
        textBaseline: "top",
        text: cfg.label,
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
    const height = cfg.size[1];

    const circleParams = {
      x: -width / 2 + height / 2,
      y: 0,
      r: height / 2,
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
        shape.attr("fill", null);
        label.attr("text", "0");
      }
    }
  },
};

export default input;