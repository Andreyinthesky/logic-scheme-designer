import NOT_GATE from "@assets/svg_elements/NOT_ANSI.svg";
import base from "./base";
import { DIRECTION_LEFT } from "../../model/enum/directions";

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

    this.doRotate(cfg, group);

    return shape;
  },
  setState(name, value, item) {
    base.setState(name, value, item);
  },
  doRotate(cfg, group) {
    const elementImage = group.get("children")[0];
    const { direction } = cfg;
    if (direction === DIRECTION_LEFT) {
      elementImage.rotate(Math.PI);
    }
  }
};

export default not;