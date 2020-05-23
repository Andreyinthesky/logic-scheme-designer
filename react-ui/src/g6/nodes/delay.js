import DELAY_GATE from "@assets/svg_elements/Buffer_ANSI.svg";
import base from "./base";
import { DIRECTION_LEFT } from "../../model/directions";
const zMarkOffsetX = 35;
const zMarkOffsetY = -12;

const delay = {
  ...base,

  draw(cfg, group) {
    const width = cfg.size[0];
    const height = cfg.size[1];

    const shape = group.addShape("image", {
      attrs: {
        x: -width / 2,
        y: -height / 2,
        img: DELAY_GATE,
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

    // z mark
    group.addShape("text", {
      attrs: {
        x: zMarkOffsetX,
        y: zMarkOffsetY,
        textAlign: "center",
        textBaseline: "middle",
        text: "Z",
        fontWeight: "bold",
        fontSize: 14,
        fontFamily: "Segoe UI, sans-serif",
        fill: cfg.color || "#000",
      },
    });

    //state
    const stateTextOffsetX = 0;
    const stateTextOffsetY = 1;
    group.addShape("text", {
      attrs: {
        x: stateTextOffsetX,
        y: stateTextOffsetY,
        textAlign: "center",
        textBaseline: "middle",
        text: "0",
        fontWeight: "bold",
        fontSize: 20,
        fontFamily: "Segoe UI, sans-serif",
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

    this.doRotate(cfg, group);

    return shape;
  },

  setState(name, value, item) {
    base.setState(name, value, item);
    const group = item.getContainer();
    const label = group.get("children")[3];

    if (name === "enable") {
      if (value) {
        label.attr("text", "1");
      } else {
        label.attr("text", "0");
      }
    }
  },
  doRotate(cfg, group) {
    const elementImage = group.get("children")[0];
    const zMark = group.get("children")[2];
    const { direction } = cfg;
    if (direction === DIRECTION_LEFT) {
      elementImage.rotate(Math.PI);
      zMark.attr({ x: -zMarkOffsetX, y: zMarkOffsetY });
    }
  }
};

export default delay;