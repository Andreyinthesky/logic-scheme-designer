import DELAY_GATE from "@assets/svg_elements/Buffer_ANSI.svg";
import base from "./base";

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
    const zMarkOffsetX = 15;
    const zMarkOffsetY = -15;
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
    const stateTextOffsetX = -6;
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
};

export default delay;