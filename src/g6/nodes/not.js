import NOT_GATE from "../../assets/svg_elements/NOT_ANSI.svg";
import base from "./base";

const not = {
  ...base,

  draw(cfg, group) {
    const width = cfg.size[0];
    const height = cfg.size[1];

    const shape = group.addShape("image", {
      attrs: {
        x: -width / 2,
        y: -height / 2,
        img: NOT_GATE,
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

  setState(name, value, item) {
    base.setState(name, value, item);

    if (name === "rotate") {
      const shape = item.getKeyShape();
      const model = item.getModel();

      if (value) {
        shape.rotate(Math.PI);
        model.anchorPoints = [[1, 0.5], [0, 0.5]];
      } else {
        shape.rotate(-Math.PI);
        model.anchorPoints = [[0, 0.5], [1, 0.5]];
      }
    }
  },
};

export default not;