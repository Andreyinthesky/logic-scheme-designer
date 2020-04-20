import AND_GATE from "../../assets/svg_elements/AND_ANSI.svg";

const and = {
  draw(cfg, group) {
    const width = cfg.size[0];
    const height = cfg.size[1];

    const shape = group.addShape("image", {
      attrs: {
        x: -width / 2,
        y: -height / 2,
        img: AND_GATE,
        width: width,
        height: height,
      }
    });

    //label text
    group.addShape("text", {
      attrs: {
        x: 0,
        y: height / 2,
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
};

export default and;