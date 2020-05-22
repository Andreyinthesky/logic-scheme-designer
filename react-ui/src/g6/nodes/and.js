import AND_GATE from "@assets/svg_elements/AND_ANSI.svg";
import base from "./base";

const and = {
  ...base,

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

    //background for better interaction
    const marginX = 10;
    group.addShape("rect", {
      attrs: {
        x: -width / 2 - marginX,
        y: -height / 2,
        width: width + marginX * 2,
        height: height,
        fill: "white",
        opacity: 0,
      }
    });

    return shape;
  },
};

export default and;