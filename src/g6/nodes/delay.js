import DELAY_GATE from "../../assets/svg_elements/Buffer_ANSI.svg";

const delay = {
  draw(cfg, group) {
    cfg.size = [100, 50];

    const shape = group.addShape("image", {
      attrs: {
        x: 0,
        y: 0,
        img: DELAY_GATE,
        width: cfg.size[0],
        height: cfg.size[1],
      }
    });

    // z mark
    const zMarkOffsetX = 15;
    const zMarkOffsetY = -15;
    group.addShape("text", {
      attrs: {
        x: cfg.size[0] / 2 + zMarkOffsetX,
        y: cfg.size[1] / 2 + zMarkOffsetY,
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
        x: cfg.size[0] / 2 + stateTextOffsetX,
        y: cfg.size[1] / 2 + stateTextOffsetY,
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
};

export default delay;