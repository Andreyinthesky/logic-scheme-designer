const connectorOffset = 25;
const defaultSize = [65, 50];

const output = {
  draw(cfg, group) {
    cfg.size = defaultSize;
    const width = cfg.size[0];
    const height = cfg.size[1];

    const shape = group.addShape("path", {
      attrs: {
        ...cfg.style,
        path: [["M", -width / 2, 0], ["l", connectorOffset, 0]],
        stroke: cfg.color || "#000",
        lineWidth: 3,
      }
    })

    group.addShape("path", {
      attrs: {
        ...cfg.style,
        path: this.getPath(cfg),
        stroke: cfg.color || "#000",
        lineWidth: cfg.lineWidth || 6,
        fill: cfg.fill || "#fff",
      },
    });

    const text = group.addShape("text", {
      attrs: {
        x: connectorOffset / 2,
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
        x: -width / 2 - marginX,
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
        x: width / 2 - (width - connectorOffset) / 2,
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

  getPath(cfg) {
    const width = cfg.size[0];
    const height = cfg.size[1];

    const path = [
      ["M", -width / 2 + connectorOffset, height / 2],
      ["L", width / 2, height / 2],
      ["L", width / 2, -height / 2],
      ["L", -width / 2 + connectorOffset, -height / 2],
      ["Z"]
    ];

    return path;
  },

  setState(name, value, item) {
    const group = item.getContainer();
    const label = group.get("children")[2];

    if (name === "enable") {
      if (value) {
        label.attr("text", "1");
      } else {
        label.attr("text", "0");
      }
    }
  },
};

export default output;