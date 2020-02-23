import BaseElement from "../BaseElement";

import AND_GATE from "../../assets/svg_elements/AND_ANSI.svg";

export default class AndGate extends BaseElement {
  constructor(id, position) {
    super(id, position);

    this.shape = "image";
    this.img = AND_GATE;
    this.size = [100, 50];
    this.anchorPoints = [[0, 0.685], [0, 0.315], [1, 0.5]];
  }

  getInputAnchors() {
    return this.anchorPoints.slice(0, 2).map((_, i) => i);
  }

  getOutputAnchors() {
    return this.anchorPoints.slice(2, 3).map((_, i) => i);
  }

  evaluate(in1, in2) { return in1 && in2 };
}